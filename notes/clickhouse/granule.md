---
date: 2026-10-24
---

# ClickHouse Granule

> A granule is the smallest block of rows ClickHouse reads from a MergeTree data part: by default 8192 consecutive rows in sorting-key order. The primary index and the marks both have one entry per granule, so ClickHouse prunes, locates and reads data granule by granule, never row by row.

## Questions this answers

- What is a granule, and how big is it?
- How do the primary index and marks use granules?
- Why does a point lookup still read thousands of rows?
- How do I see how many granules a query reads?

## Notes

### What a granule is

- Every data part ([data-part.md](data-part.md)) is cut into granules: runs of consecutive rows, already sorted by `ORDER BY`.
- A granule is a **logical** split across all columns. Granule 5 means the same rows in every column file.
- A granule ends at `index_granularity` rows (8192), or earlier when its data reaches `index_granularity_bytes` (10 MiB). That second limit is **adaptive granularity**: wide rows get smaller granules, so one granule stays a reasonable size to read.
- The last granule of a part is usually partial.

### Granule vs compressed block

- A **compressed block** is a physical unit in `<col>.bin`, sized by `min_compress_block_size` (64 KiB) and `max_compress_block_size` (1 MiB).
- A granule and a block do not line up. A small granule can share a block with others. A large granule can span several blocks.
- **Marks** connect the two. Per column, each mark stores:
  - the offset of the compressed block in `<col>.bin`;
  - the offset inside that block once it is decompressed.

### Primary index: one entry per granule

- `primary.cidx` stores the sorting-key value of the first row of each granule. That is why it is called **sparse**.
- 1 billion rows / 8192 ≈ 122k index entries. That is small enough to keep in memory for every part.
- How the index is used depends on what the query filters on:
  - **Prefix of the key:** ClickHouse binary-searches the entries to find the granule range that may match.
  - **Only a later key column:** it falls back to "generic exclusion search". That works only when the earlier columns have few distinct values.
- The index can only say "this granule *may* contain matches". Exact filtering happens after the granule is read.

### Query read path

1. Prune parts by partition (`minmax_*.idx`, `partition.dat`).
2. Prune granules with the primary index, then with any skip indexes.
3. Turn the remaining granule ranges into file offsets using the marks of each needed column.
4. Read and decompress only those blocks, only for the columns the query uses.
5. Apply `WHERE` row by row on what was read.

### Skip indexes work in granules too

`INDEX idx col TYPE minmax GRANULARITY N` stores one entry per **N granules**, not per N rows. With `GRANULARITY 4` and the default 8192, one entry covers 32768 rows.

### Picking `index_granularity`

| Smaller granules (e.g. 1024) | Larger granules (default 8192) |
| --- | --- |
| Point lookups read fewer extra rows | Fewer index entries and marks |
| Bigger index and marks in memory and on disk | Each pruned-in granule reads more rows |

The default suits analytics scans. Lower it only for a table that serves many key lookups, and measure with `EXPLAIN indexes = 1`.

## Gotchas

- The minimum read is a whole granule. `WHERE user_id = 42` on 100 rows still reads up to 8192 rows per touched column.
- `system.parts.marks` = granules + 1. Wide parts keep a final mark that points to the end of the data.
- Filtering only on a non-leading key column usually reads every granule. In the lab it read 123/123.
- `index_granularity` is fixed when the table is created. Changing it means recreating the table.
- Very wide rows shrink granules through `index_granularity_bytes`, so there are more marks than `rows / 8192` suggests.

## Open questions

- How does the reader merge adjacent granule ranges, and what does `merge_tree_min_rows_for_seek` change?
- How do the uncompressed cache and the mark cache interact on repeated point lookups?

## Lab

Run against `labs/` (ClickHouse 25.8).

```sql
CREATE TABLE g_demo (user_id UInt64, ts DateTime, v UInt32)
ENGINE = MergeTree ORDER BY (user_id, ts);
INSERT INTO g_demo SELECT number % 10000, toDateTime('2026-10-01') + number, number FROM numbers(1000000);
OPTIMIZE TABLE g_demo FINAL;

SELECT rows, marks, part_type FROM system.parts WHERE table = 'g_demo' AND active;
-- 1000000 │ 124 │ Wide        <- 123 granules + final mark

EXPLAIN indexes = 1 SELECT count() FROM g_demo WHERE user_id = 42;
-- Condition: (user_id in [42, 42])
-- Granules: 1/123
-- Search Algorithm: binary search

EXPLAIN indexes = 1 SELECT count() FROM g_demo WHERE ts = toDateTime('2026-10-01 00:10:00');
-- Granules: 123/123
-- Search Algorithm: generic exclusion search
```

Adaptive granularity with 10 KB rows:

```sql
CREATE TABLE g_wide (id UInt64, payload String) ENGINE = MergeTree ORDER BY id;
INSERT INTO g_wide SELECT number, randomPrintableASCII(10000) FROM numbers(20000);
OPTIMIZE TABLE g_wide FINAL;

SELECT rows, marks, round(rows / (marks - 1)) AS rows_per_granule
FROM system.parts WHERE table = 'g_wide' AND active;
-- 20000 │ 21 │ 1000        <- ~10 MiB / 10 KB, not 8192
```

## Sources

- Primary indexes guide (granules, marks, binary vs generic exclusion search): <https://clickhouse.com/docs/guides/best-practices/sparse-primary-indexes>
- MergeTree engine, data storage: <https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree>
- MergeTree settings (`index_granularity`, `index_granularity_bytes`): <https://clickhouse.com/docs/operations/settings/merge-tree-settings>
- Data skipping indexes: <https://clickhouse.com/docs/optimize/skipping-indexes>
