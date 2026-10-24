---
date: 2026-10-24
---

# ClickHouse Data Part

> A data part is the unit of storage in a MergeTree table: an immutable directory holding rows sorted by the table's `ORDER BY` key. Every `INSERT` writes new parts, and background merges keep rewriting small parts into bigger ones within one partition.

## Questions this answers

- What does an `INSERT` actually create on disk?
- What do part names like `202610_1_2_1` mean?
- What files are inside a part, and what is the difference between Wide and Compact?
- Why do too many small inserts end in `TOO_MANY_PARTS`?

## Notes

### What a part is

- A MergeTree table is a set of **parts**. A part is one directory under the table's data path (`/var/lib/clickhouse/store/<uuid-prefix>/<uuid>/<part_name>/` with the Atomic database engine).
- Each `INSERT` block becomes at least one new part **per partition** it touches. One insert spanning two months under `PARTITION BY toYYYYMM(ts)` produces two parts.
- Parts are **immutable**. Nothing is edited in place. Merges, mutations and lightweight deletes all write new parts and retire old ones.
- Inside a part, rows are sorted by the sorting key (`ORDER BY`). That ordering is what makes the sparse primary index and data skipping work.
- Parts from different partitions are never merged together. A partition is a group of parts; a part belongs to exactly one partition.

### Part name: `{partition_id}_{min_block}_{max_block}_{level}[_{mutation}]`

| Piece | Meaning |
| --- | --- |
| `partition_id` | Partition the part belongs to (`202610`, or `all` when there is no `PARTITION BY`). |
| `min_block` / `max_block` | Range of insert block numbers covered. A fresh insert has `min = max`. A merge covers the union of its inputs. |
| `level` | Merge depth. `0` = straight from an insert. A merge result gets `max(input levels) + 1`. |
| `mutation` (optional) | Data version after a mutation (`ALTER ... UPDATE/DELETE`). |

Block numbers are allocated per table and increase monotonically, so the name alone tells you which inserts are inside a part and in what order they arrived.

Examples from the lab (see below):

- `202610_1_1_0` + `202610_2_2_0` merge into `202610_1_2_1`.
- `202609_3_3_0` becomes `202609_3_3_1` after `OPTIMIZE ... FINAL`. That is a one-part merge that only bumps the level.
- `all_1_1_0` becomes `all_1_1_0_2` after an `ALTER UPDATE` that got mutation version `2`.

### Lifecycle

1. **Insert:** data is sorted and compressed and written to a temporary directory (`tmp_insert_*`). It is then renamed into place and becomes `Active`.
2. **Merge:** a background thread picks adjacent parts within one partition and writes a merged part. Inputs become `Outdated`.
3. **Cleanup:** outdated parts stay on disk for `old_parts_lifetime` (default 480 s), so a crash during a merge does not lose data. Then they are deleted.
4. **Detach:** `ALTER TABLE ... DETACH PART|PARTITION` moves parts to `detached/`. ClickHouse also moves broken or unexpected parts there at startup. `ATTACH` brings them back.

`system.parts.active` = 1 marks the parts that queries read. Inactive rows are outdated parts waiting for cleanup.

### Wide vs Compact

| | Compact | Wide |
| --- | --- | --- |
| Layout | All columns in one `data.bin` + one marks file | One `<column>.bin` + marks file per column |
| When | Part smaller than `min_bytes_for_wide_part` (10 MiB) or `min_rows_for_wide_part` (0 = off) | Part at or above the threshold |
| Good for | Small fresh inserts: far fewer files and fsyncs | Big merged parts: read only the columns a query needs |

Small inserts land as Compact. Merges turn them into Wide once the result crosses the threshold.

### Files inside a part (25.8)

| File | Purpose |
| --- | --- |
| `<col>.bin` / `data.bin` | Column data, compressed in blocks |
| `<col>.cmrk2` / `data.cmrk4` | **Marks**: per granule, offset into the compressed file + offset inside the decompressed block. The `c` prefix means compressed marks. |
| `primary.cidx` | Sparse primary index: sorting-key values of the first row of each granule (compressed; older versions use `primary.idx`) |
| `minmax_<col>.idx` | Min/max of the partition-key columns, for partition pruning |
| `partition.dat` | Partition key value |
| `count.txt` | Row count |
| `columns.txt`, `serialization.json`, `columns_substreams.txt` | Column list, types and per-column serialization |
| `checksums.txt` | Sizes and hashes of every file, checked on load and fetch |
| `default_compression_codec.txt`, `metadata_version.txt` | Codec and table metadata version used when the part was written |
| `skp_idx_<name>.idx` / `.cmrk2` | Data-skipping index, when the table defines one |

### Granules and marks

- A part is split into **granules** of `index_granularity` rows (8192). With adaptive granularity, a granule also closes at `index_granularity_bytes` (10 MiB).
- A granule is the smallest unit ClickHouse reads. The primary index has one entry per granule, not per row, so it fits in memory.
- Query path: the primary index picks the granule range, marks turn granules into file offsets, and only those compressed blocks get read and decompressed.

### Why part count matters

- Every query opens every active part it cannot prune. Thousands of tiny parts mean thousands of directories, index loads and file reads.
- Merges cannot keep up with very frequent small inserts. Per partition, ClickHouse:
  - delays inserts at `parts_to_delay_insert` (1000) active parts;
  - throws `TOO_MANY_PARTS` at `parts_to_throw_insert` (3000).
- Fix it on the write side: batch inserts (thousands to hundreds of thousands of rows each), use `async_insert = 1` for many small clients, and don't partition too finely.
- Merges stop growing a part past `max_bytes_to_merge_at_max_space_in_pool` (150 GiB), so a big table always has several parts per partition.

## Gotchas

- `PARTITION BY` is not an index. Over-fine partitioning (by day with little data, or by user) multiplies parts and blocks merges, because parts never merge across partitions.
- `OPTIMIZE TABLE ... FINAL` rewrites whole partitions. It is a debugging and lab tool, not something to run on a schedule.
- Mutations rewrite every part that has matching rows. Unchanged columns are hard-linked, but it is still heavy I/O, unlike an UPDATE in a row store.
- Inactive parts are still listed in `system.parts`. Filter on `active` before counting.
- Merge results depend on timing. Don't assume an exact part layout in tests unless merges are stopped (`SYSTEM STOP MERGES`).

## Open questions

- How does the merge selector choose which parts to merge (`SimpleMergeSelector`, size ratios, TTL merges)?
- How do `ReplicatedMergeTree` replicas agree on part names and merges through Keeper?
- What do lightweight `DELETE` (`_row_exists` mask) and on-the-fly mutations change about part rewrites?

## Lab

Run against `labs/` (ClickHouse 25.8).

```sql
CREATE TABLE parts_demo (ts DateTime, user_id UInt32, event String)
ENGINE = MergeTree PARTITION BY toYYYYMM(ts) ORDER BY (user_id, ts);

SYSTEM STOP MERGES parts_demo;
INSERT INTO parts_demo SELECT toDateTime('2026-10-01') + number, number % 100, 'click' FROM numbers(1000);
INSERT INTO parts_demo SELECT toDateTime('2026-10-02') + number, number % 100, 'view'  FROM numbers(1000);
INSERT INTO parts_demo SELECT toDateTime('2026-09-15') + number, number % 100, 'view'  FROM numbers(1000);

SELECT name, partition_id, min_block_number, max_block_number, level, rows, part_type, active
FROM system.parts WHERE table = 'parts_demo' ORDER BY name;
```

```text
202609_3_3_0 │ 202609 │ 3 │ 3 │ 0 │ 1000 │ Compact │ 1
202610_1_1_0 │ 202610 │ 1 │ 1 │ 0 │ 1000 │ Compact │ 1
202610_2_2_0 │ 202610 │ 2 │ 2 │ 0 │ 1000 │ Compact │ 1
```

```sql
SYSTEM START MERGES parts_demo;
OPTIMIZE TABLE parts_demo FINAL;
SELECT name, level, rows, active FROM system.parts WHERE table = 'parts_demo' ORDER BY name;
```

```text
202609_3_3_0 │ 0 │ 1000 │ 0
202609_3_3_1 │ 1 │ 1000 │ 1
202610_1_1_0 │ 0 │ 1000 │ 0
202610_1_2_1 │ 1 │ 2000 │ 1
202610_2_2_0 │ 0 │ 1000 │ 0
```

Look inside a part: take `path` from `system.parts`, then
`docker compose exec clickhouse ls <path>`. A table created with `SETTINGS min_bytes_for_wide_part = 0` shows the Wide layout (`ts.bin`, `ts.cmrk2`, ...).

## Sources

- MergeTree engine: <https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree>
- Table parts: <https://clickhouse.com/docs/parts>
- `system.parts`: <https://clickhouse.com/docs/operations/system-tables/parts>
- MergeTree settings: <https://clickhouse.com/docs/operations/settings/merge-tree-settings>
- Source: `src/Storages/MergeTree/MergeTreePartInfo.cpp` (part name parsing)
