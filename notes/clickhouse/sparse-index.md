---
date: 2026-10-31
---

# ClickHouse Sparse Index

> The MergeTree primary index is sparse: it has one entry per granule (by default per 8192 rows), not one per row. Each entry is the sorting-key value of the granule's first row. The index is small enough to keep in memory. It cannot find a row. It can only find the granules that may contain the row, and ClickHouse then reads those granules in full.

## Questions this answers

- What does "sparse" mean, and how is it different from a B-tree index?
- What is stored on disk and what is kept in memory?
- Which filters can use the index, and which cannot?
- Why does the order of the key columns matter so much?

## Notes

### Dense vs sparse

| | Dense index (B-tree in Postgres/MySQL) | Sparse index (MergeTree) |
| --- | --- | --- |
| Entries | One per row | One per granule (~8192 rows) |
| Points to | An exact row | A granule: a range of rows |
| Size for 1B rows | Billions of entries, mostly on disk | ~122k entries, fits in RAM |
| Point lookup | Reads 1 row | Reads at least 1 whole granule |
| Uniqueness | Can enforce `UNIQUE` | Never enforces anything |
| Maintenance on insert | Updates the tree in place | Nothing to update: each new part has its own index |

A sparse index works only because the data is **physically sorted** by the key. When entry `i` is `81` and entry `i+1` is `163`, every row between them has a key in `[81, 163]`. A dense index does not need sorted data. A sparse index does.

### What is in the index

- One index per data part ([data-part.md](data-part.md)), in `primary.cidx` (compressed `primary.idx`).
- Entry `i` = values of all `PRIMARY KEY` columns in the first row of granule `i` ([granule.md](granule.md)).
- Entry count = `marks` in `system.parts`. Wide parts have one extra final entry.
- The index stores **key values**, not offsets. Offsets live in the per-column mark files (`<col>.cmrk2`). Index entry `i` and mark `i` describe the same granule.
- Inspect it with `mergeTreeIndex(db, table)`.

### How a query uses it

1. Build key conditions from `WHERE`, for example `user_id in [42, 42]`.
2. Per part, find the mark ranges that may match:
   - **Binary search** when the condition is on a key prefix. Cost is O(log granules).
   - **Generic exclusion search** otherwise. It recursively splits the mark range and drops a sub-range when the key bounds prove that no row in it can match.
3. Read the surviving granules through the marks, only for the columns the query needs.
4. Apply the exact `WHERE` to the rows that were read.

`EXPLAIN indexes = 1` shows the condition, `Granules: x/y`, and which search ran.

### Which filters use it

- `=`, `IN`, `<`, `>`, `BETWEEN`, and `LIKE 'prefix%'` on key columns.
- A prefix of the key (`user_id`, or `user_id AND ts`): binary search, tight ranges.
- Monotonic functions of a key column (`toDate(ts)`, `user_id + 1`): the bounds can still be computed.
- Non-monotonic functions (`user_id % 2`, `lower(s)`): `Condition: true`, so every granule is read.
- A non-leading key column alone: generic exclusion search. This prunes well only when the columns before it have **low cardinality**.

### Key column order

Order columns by **ascending cardinality** when queries can filter on any of them.

- `ORDER BY (tenant, user_id)` with 4 tenants: a filter on `user_id` only still pruned to 7/122 granules. Inside each tenant, `user_id` is sorted, so the index entries bound it.
- `ORDER BY (user_id, tenant)`: a filter on `tenant` only read 122/122. `user_id` changes on every row, so the entries say nothing about `tenant`.

Low-cardinality-first ordering also compresses better, because long runs of equal values sit next to each other.

### In memory

- `primary_key_lazy_load = 1` (default): the index is loaded on the first query that uses it, not at startup. Before that, `primary_key_bytes_in_memory` is `0`.
- Once loaded, it stays in memory for the life of the part, unless `use_primary_key_cache = 1` puts it in an evictable LRU cache (like the mark cache).
- `primary_key_ratio_of_unique_prefix_values_to_skip_suffix_columns = 0.9` (default): when a key prefix is already distinct in ≥ 90% of the entries, the suffix columns are not loaded into memory. They could not narrow anything anyway. Lab: key `(user_id, ts)` used 992 B (124 × 8 B, `user_id` only) instead of 1488 B (124 × 12 B).
- Rough memory per part: `marks × sum(key column sizes)`. Long `String` key columns are where this gets large.

## Gotchas

- "Primary key" does not mean unique. Two inserts with the same `id` both stay. Only some engines (`ReplacingMergeTree`) deduplicate, and only during merges.
- The smallest read is a whole granule. A point lookup that matches 100 rows still read 8192 rows.
- A filter that wraps a key column in a non-monotonic function turns into a full scan without any warning. Check with `EXPLAIN indexes = 1`.
- With the default skip-suffix behaviour, `mergeTreeIndex` returns default values (`1970-01-01 00:00:00`) for the suffix columns that were dropped from memory. The data is still on disk.
- Each part has its own index. Many small parts mean many index searches and more memory, which is one more reason to batch inserts.
- `PRIMARY KEY` can be a prefix of `ORDER BY` to keep the index smaller ([primary-key-vs-order-by.md](primary-key-vs-order-by.md)).

## Open questions

- How does generic exclusion search choose where to split (`merge_tree_coarse_index_granularity`)?
- When is `use_primary_key_cache` worth it in practice: only on shared storage with huge tables, or also on single-node setups?

## Lab

Run against `labs/` (ClickHouse 25.8).

```sql
CREATE TABLE si_demo (user_id UInt64, ts DateTime, v UInt32)
ENGINE = MergeTree ORDER BY (user_id, ts);
INSERT INTO si_demo SELECT number % 10000, toDateTime('2026-10-01') + number, number FROM numbers(1000000);
OPTIMIZE TABLE si_demo FINAL;

SELECT rows, marks, primary_key_size, primary_key_bytes_in_memory
FROM system.parts WHERE table = 'si_demo' AND active;
-- 1000000 │ 124 │ 684 │ 992      <- 124 entries for 1M rows, 684 B on disk

SELECT mark_number, rows_in_granule, user_id FROM mergeTreeIndex(currentDatabase(), si_demo) LIMIT 3;
-- 0 │ 8192 │   0
-- 1 │ 8192 │  81
-- 2 │ 8192 │ 163               <- first key of each granule

EXPLAIN indexes = 1 SELECT count() FROM si_demo WHERE user_id = 42;
-- Granules: 1/123, Search Algorithm: binary search
EXPLAIN indexes = 1 SELECT count() FROM si_demo WHERE user_id BETWEEN 100 AND 200;
-- Granules: 2/123, binary search
EXPLAIN indexes = 1 SELECT count() FROM si_demo WHERE user_id + 1 = 43;
-- Granules: 1/123, generic exclusion search   <- monotonic, still pruned
EXPLAIN indexes = 1 SELECT count() FROM si_demo WHERE user_id % 2 = 0;
-- Condition: true, Granules: 123/123
EXPLAIN indexes = 1 SELECT count() FROM si_demo WHERE ts = toDateTime('2026-10-01 00:10:00');
-- Granules: 123/123, generic exclusion search  <- non-leading, high-cardinality prefix

-- read_rows from system.query_log:
-- WHERE user_id = 42                    -> 8192      (100 matching rows)
-- WHERE ts = '2026-10-01 00:10:00'      -> 1000000
```

Key column order:

```sql
CREATE TABLE si_low_first  (tenant UInt8, user_id UInt64) ENGINE = MergeTree ORDER BY (tenant, user_id);
CREATE TABLE si_high_first (tenant UInt8, user_id UInt64) ENGINE = MergeTree ORDER BY (user_id, tenant);
INSERT INTO si_low_first  SELECT number % 4, number FROM numbers(1000000);
INSERT INTO si_high_first SELECT number % 4, number FROM numbers(1000000);

EXPLAIN indexes = 1 SELECT count() FROM si_low_first  WHERE user_id = 500000;  -- Granules: 7/122
EXPLAIN indexes = 1 SELECT count() FROM si_high_first WHERE tenant = 2;        -- Granules: 122/122
```

Lazy load and skipped suffix columns:

```sql
DETACH TABLE si_demo; ATTACH TABLE si_demo;
SELECT primary_key_bytes_in_memory FROM system.parts WHERE table = 'si_demo' AND active;  -- 0
SELECT count() FROM si_demo WHERE user_id = 42;
SELECT primary_key_bytes_in_memory FROM system.parts WHERE table = 'si_demo' AND active;  -- 992

CREATE TABLE si_keep (user_id UInt64, ts DateTime, v UInt32)
ENGINE = MergeTree ORDER BY (user_id, ts)
SETTINGS primary_key_ratio_of_unique_prefix_values_to_skip_suffix_columns = 1.1;
INSERT INTO si_keep SELECT * FROM si_demo;
OPTIMIZE TABLE si_keep FINAL;
-- after one query: primary_key_bytes_in_memory = 1488 (user_id + ts) vs 992 (user_id only)
```

Not unique:

```sql
CREATE TABLE si_dup (id UInt64, s String) ENGINE = MergeTree ORDER BY id;
INSERT INTO si_dup VALUES (1, 'a');
INSERT INTO si_dup VALUES (1, 'b');
SELECT * FROM si_dup;  -- both rows
```

## Sources

- A practical introduction to primary indexes: <https://clickhouse.com/docs/guides/best-practices/sparse-primary-indexes>
- MergeTree primary key settings (`primary_key_lazy_load`, `use_primary_key_cache`): <https://clickhouse.com/docs/reference/settings/merge-tree-settings/primary-key>
- `system.parts` columns (`primary_key_bytes_in_memory`): <https://clickhouse.com/docs/reference/system-tables/parts>
- `mergeTreeIndex` table function: <https://clickhouse.com/docs/sql-reference/table-functions/mergeTreeIndex>
- Primary index cache, 24.12 changelog: <https://clickhouse.com/docs/resources/changelogs/oss/2024>
