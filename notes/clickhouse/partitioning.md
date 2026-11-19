---
date: 2026-11-19
concepts: MergeTree storage
---

# ClickHouse Partitioning

> A partition is the group of parts that share one value of the `PARTITION BY` expression. ClickHouse never merges parts across partitions, and it can drop, detach, attach or replace a whole partition without rewriting data. That makes partitioning a data-management tool, not an index: the `ORDER BY` key does the query pruning, and too many partitions makes inserts, merges and point queries slower.

## Questions this answers

- What is a partition on disk, and how is its ID derived?
- Does partitioning make queries faster?
- What can I do with a whole partition that I cannot do cheaply with rows?
- How do I choose a partition key, and what happens when I choose a bad one?

## Notes

### What a partition is

- `PARTITION BY expr` is evaluated per row. Rows with the same value belong to the same partition. Without `PARTITION BY`, everything is in one partition called `all`.
- An `INSERT` block is split by partition, and each piece becomes its own part ([data-part.md](data-part.md)). Lab: one insert of 1M rows spanning four months produced four parts, `202609_1_1_0` … `202612_4_4_0`, each with its own block number.
- Merges only combine parts from the same partition. Lab: 8 parts in 4 months became 4 parts after `OPTIMIZE ... FINAL`, one per month. The same data without a partition key became 1 part.
- A partition has no directory of its own. It exists as the part-name prefix plus two files in every part: `partition.dat` (the key value) and `minmax_<col>.idx` (min/max of each column used in the key).

### Partition ID

The ID is what part names and `PARTITION ID '...'` use. `system.parts.partition` shows the readable value.

| `PARTITION BY` | `partition` | `partition_id` |
| --- | --- | --- |
| none | `tuple()` | `all` |
| `toYYYYMM(ts)` | `202610` | `202610` |
| `toDate(ts)` | `2026-01-01` | `20260101` |
| `(toYYYYMM(ts), shard)`, `shard UInt8` | `(202610,3)` | `202610-3` |
| `kind` (`String`) | `click` | `de50b3b606d4b8b0b6ccc0d713789d66` |
| `(toYYYYMM(ts), kind)` | `(202610,'click')` | `5daf0cac7423c177524a7e354621f8a6` |

Integers and dates give readable IDs, and tuple elements are joined with `-`. As soon as a `String` is involved, the whole ID becomes a 128-bit hash.

### How queries use partitions

`EXPLAIN indexes = 1` shows two partition-related steps before `PrimaryKey`:

- **MinMax** checks the filter against `minmax_<col>.idx`, the raw min/max of each key column in each part.
- **Partition** checks the filter against the partition expression value.

Lab, table `PARTITION BY toYYYYMM(ts) ORDER BY (user_id, ts)`, 4 parts:

| Filter | MinMax parts | Why |
| --- | --- | --- |
| `ts` in October | 1/4 | Range on a key column |
| `toYYYYMM(ts) = 202610` | 1/4 | Rewritten to a `ts` range (`optimize_time_filter_with_preimage = 1`) |
| `toDate(ts) = '2026-10-15'` | 1/4 | Monotonic function of a key column |
| `toDayOfWeek(ts) = 1` | 3/4 | The December part only covers Tue–Wed, so its bounds rule Monday out |
| `user_id = 42` | 4/4 | Not a partition column |

### Partitioning is not an index

Same 2M rows, merged to one part per partition, `read_rows` from `system.query_log`:

| Query | `PARTITION BY toYYYYMM(ts)`, `ORDER BY (user_id, ts)` | No partition, `ORDER BY (user_id, ts)` |
| --- | --- | --- |
| `user_id = 42` | 32 768 (4 parts × 1 granule) | 8 192 (1 granule) |
| `ts` in October | 669 600 (1 part) | 2 000 000 (full scan) |

- **Point lookups on the sort key get slower.** Every partition is a separate part with its own index search, and each search reads at least one granule ([sparse-index.md](sparse-index.md)). Four months cost 4× the rows; three years of monthly partitions would cost 36×.
- **Partitions help only when the sort key cannot.** Here `ts` is not a key prefix, so the unpartitioned table scanned everything, and partition MinMax cut it to one month.
- Putting a time bucket first in `ORDER BY (toStartOfMonth(ts), user_id, ts)` without a partition did not reproduce that. `WHERE toStartOfMonth(ts) = '2026-10-01'` pruned to 82/245 granules, but a raw `ts` range read 245/245, because the condition was not mapped onto the `toStartOfMonth(ts)` key. Partition MinMax works on the raw column, which is its real advantage.

Design `ORDER BY` for queries ([primary-key-vs-order-by.md](primary-key-vs-order-by.md)). Treat partition pruning as a side effect.

### Operating on whole partitions

| Statement | Effect |
| --- | --- |
| `DROP PARTITION p` | Removes every part of `p`. No data is rewritten. |
| `DETACH PARTITION p` / `ATTACH PARTITION p` | Moves the parts to `detached/` and back. Detached parts are invisible to queries and listed in `system.detached_parts`. |
| `REPLACE PARTITION p FROM src` | Atomically swaps `p` for a copy of `src`'s `p`. `src` keeps its data. |
| `ATTACH PARTITION p FROM src` | Copies `src`'s `p` in, without replacing anything. |
| `MOVE PARTITION p TO TABLE dst` | Moves `p` to `dst` and removes it from the source. |

- The cross-table statements require the same columns, partition key, `ORDER BY`, primary key and storage policy, and the destination must have every index and projection of the source. `CREATE TABLE stage AS target` gets this right.
- Name a partition by value (`PARTITION 202609`, `PARTITION (202610, 'view')`) or by ID (`PARTITION ID '202612'`). Hashed IDs are only usable through `PARTITION ID`.
- Lab, `REPLACE PARTITION 202611 FROM pt_stage`: 648 000 rows became 43 200, the new part got a fresh block number (`202611_11_11_0`), and the staging table still had its 43 200 rows. This is the backfill pattern: rebuild one month in a staging table, then swap it in.

Compared with deleting rows:

- `DELETE FROM pt_demo WHERE ts < '2026-11-01'` (a lightweight delete) only masked rows. Every active part got a new mutation suffix (`_9`), including months with nothing to delete, and `system.parts.rows` for October stayed at 669 600 until a merge.
- `DROP PARTITION 202609` left the other parts untouched. The dropped parts became inactive, next to an empty covering part `202609_1_5_2`, and are removed after `old_parts_lifetime` (480 s).

### Choosing a key

- **Default: no partition key.** Add one when you need to drop, move or replace data in time-sized units, e.g. retention or monthly backfills.
- **Month (`toYYYYMM`) is usually enough.** Day is common for observability data with short retention.
- **Keep it low-cardinality.** The docs suggest fewer than 100–1 000 distinct values, and a table total under 1 000–10 000 partitions.
- **Never partition by customer id or name.** Put it first in `ORDER BY` instead.
- **Inserts are limited by partition count.** One insert block can touch at most `max_partitions_per_insert_block` = 100 partitions. Lab: 150 daily partitions in one insert failed with `Code: 252 ... Too many partitions for single INSERT block (more than 100)`, and nothing was written. 90 days in one insert worked and created 90 parts.
- **Part limits are counted per partition.** `parts_to_delay_insert` (1 000) and `parts_to_throw_insert` (3 000) apply per partition. `max_parts_in_total` (100 000) covers the whole table. More partitions means more parts that can never merge together.

## Gotchas

- Partitioning makes point queries on the sort key slower, by up to one granule per partition.
- A single insert that touches more than 100 partitions is rejected whole. No partial write happens.
- A `String` anywhere in the key turns every partition ID into a hash. Look up the readable value in `system.parts.partition` before writing `PARTITION ID '...'`.
- `DELETE FROM ... WHERE` on a time range is not a cheap partition drop. It touches every part and leaves the data on disk until merges.
- `REPLACE`, `MOVE` and `ATTACH ... FROM` fail unless both tables share the same structure, keys, storage policy, indexes and projections.
- `toYYYYMM(ts) = X` prunes because the analyzer rewrites it to a `ts` range. Other wrappers around the partition column may not be rewritten. Check with `EXPLAIN indexes = 1`.

## Open questions

- Why does a raw `ts` range not use an `ORDER BY toStartOfMonth(ts)` key in 25.8, while partition MinMax handles it? Is there a setting for this?
- How does `ttl_only_drop_parts` line up with partition boundaries for cheap TTL deletes?
- Does pruning work for hash partitions such as `PARTITION BY cityHash64(user_id) % 16`?

## Lab

Run against `labs/` (ClickHouse 25.8).

```sql
CREATE TABLE pt_demo (ts DateTime, user_id UInt64, v UInt32)
ENGINE = MergeTree PARTITION BY toYYYYMM(ts) ORDER BY (user_id, ts);
INSERT INTO pt_demo SELECT toDateTime('2026-09-01') + number * 8, number % 10000, number FROM numbers(1000000);

SELECT partition, partition_id, name, rows FROM system.parts WHERE table = 'pt_demo' AND active ORDER BY name;
-- 202609 │ 202609 │ 202609_1_1_0 │ 324000
-- 202610 │ 202610 │ 202610_2_2_0 │ 334800
-- 202611 │ 202611 │ 202611_3_3_0 │ 324000
-- 202612 │ 202612 │ 202612_4_4_0 │  17200     <- one insert, one part per partition

INSERT INTO pt_demo SELECT toDateTime('2026-09-01') + number * 8 + 3, number % 10000, number FROM numbers(1000000);
OPTIMIZE TABLE pt_demo FINAL;
-- 8 parts -> 202609_1_5_1, 202610_2_6_1, 202611_3_7_1, 202612_4_8_1   <- merged within each month only
```

Pruning:

```sql
EXPLAIN indexes = 1 SELECT count() FROM pt_demo WHERE ts >= '2026-10-01' AND ts < '2026-11-01';
-- MinMax: Parts 1/4, Granules 41/123
EXPLAIN indexes = 1 SELECT count() FROM pt_demo WHERE toYYYYMM(ts) = 202610;
-- MinMax: Parts 1/4   (EXPLAIN SYNTAX run_query_tree_passes = 1 shows the ts range rewrite)
EXPLAIN indexes = 1 SELECT count() FROM pt_demo WHERE toDayOfWeek(ts) = 1;
-- MinMax: Parts 3/4
EXPLAIN indexes = 1 SELECT count() FROM pt_demo WHERE user_id = 42;
-- MinMax: Parts 4/4; PrimaryKey: Granules 4/123, binary search, Ranges: 4
```

Partitioned vs not:

```sql
CREATE TABLE pt_none (ts DateTime, user_id UInt64, v UInt32) ENGINE = MergeTree ORDER BY (user_id, ts);
INSERT INTO pt_none SELECT * FROM pt_demo;
OPTIMIZE TABLE pt_none FINAL;

SELECT count() FROM pt_demo WHERE user_id = 42 SETTINGS log_comment = 'pt_demo_point';
SELECT count() FROM pt_none WHERE user_id = 42 SETTINGS log_comment = 'pt_none_point';
SELECT count() FROM pt_demo WHERE ts >= '2026-10-01' AND ts < '2026-11-01' SETTINGS log_comment = 'pt_demo_month';
SELECT count() FROM pt_none WHERE ts >= '2026-10-01' AND ts < '2026-11-01' SETTINGS log_comment = 'pt_none_month';
SYSTEM FLUSH LOGS;
SELECT log_comment, read_rows, ProfileEvents['SelectedParts'], ProfileEvents['SelectedMarks']
FROM system.query_log WHERE type = 'QueryFinish' AND log_comment LIKE 'pt_%';
-- pt_demo_point │   32768 │ 4 │   4
-- pt_none_point │    8192 │ 1 │   1
-- pt_demo_month │  669600 │ 1 │  82
-- pt_none_month │ 2000000 │ 1 │ 245

CREATE TABLE pt_sorted (ts DateTime, user_id UInt64, v UInt32)
ENGINE = MergeTree ORDER BY (toStartOfMonth(ts), user_id, ts);
INSERT INTO pt_sorted SELECT * FROM pt_demo;
OPTIMIZE TABLE pt_sorted FINAL;
EXPLAIN indexes = 1 SELECT count() FROM pt_sorted WHERE ts >= '2026-10-01' AND ts < '2026-11-01';
-- PrimaryKey Keys: ts, Granules: 245/245
EXPLAIN indexes = 1 SELECT count() FROM pt_sorted WHERE toStartOfMonth(ts) = '2026-10-01';
-- PrimaryKey Keys: toStartOfMonth(ts), Granules: 82/245, binary search
```

Partition IDs:

```sql
CREATE TABLE pt_ints (ts DateTime, shard UInt8) ENGINE = MergeTree PARTITION BY (toYYYYMM(ts), shard) ORDER BY ts;
CREATE TABLE pt_str  (ts DateTime, kind String) ENGINE = MergeTree PARTITION BY kind ORDER BY ts;
CREATE TABLE pt_tuple (ts DateTime, kind LowCardinality(String), v UInt32)
ENGINE = MergeTree PARTITION BY (toYYYYMM(ts), kind) ORDER BY ts;
-- after one row each:
-- pt_ints  (202610,3)        202610-3
-- pt_str   click             de50b3b606d4b8b0b6ccc0d713789d66
-- pt_tuple (202610,'click')  5daf0cac7423c177524a7e354621f8a6
```

Too many partitions:

```sql
CREATE TABLE pt_daily (ts DateTime, v UInt32) ENGINE = MergeTree PARTITION BY toDate(ts) ORDER BY ts;
INSERT INTO pt_daily SELECT toDateTime('2026-01-01') + number * 3600, number FROM numbers(24 * 150);
-- Code: 252. DB::Exception: Too many partitions for single INSERT block (more than 100). ... (TOO_MANY_PARTS)
-- system.parts: 0 parts
INSERT INTO pt_daily SELECT toDateTime('2026-01-01') + number * 3600, number FROM numbers(24 * 90);
-- 90 parts, partition_id 20260101 .. 20260331
```

Drop, delete, replace, detach:

```sql
ALTER TABLE pt_demo DROP PARTITION 202609;
-- active: 202610_2_6_1, 202611_3_7_1, 202612_4_8_1
-- inactive: 202609_1_1_0, 202609_5_5_0, 202609_1_5_2 (empty covering part)

DELETE FROM pt_demo WHERE ts < '2026-11-01' SETTINGS mutations_sync = 1;
-- active: 202610_2_6_1_9 │ 669600, 202611_3_7_1_9 │ 648000, 202612_4_8_1_9 │ 34400
-- count() = 682400   <- October masked, still on disk

CREATE TABLE pt_stage AS pt_demo;
INSERT INTO pt_stage SELECT toDateTime('2026-11-01') + number * 60, number % 10000, 7 FROM numbers(43200);
ALTER TABLE pt_demo REPLACE PARTITION 202611 FROM pt_stage;
-- November: 648000 rows -> 43200 rows; new part 202611_11_11_0; pt_stage still has 43200

ALTER TABLE pt_demo DETACH PARTITION ID '202612';   -- count() 43200, system.detached_parts: 202612_4_8_1_9
ALTER TABLE pt_demo ATTACH PARTITION ID '202612';   -- count() 77600
ALTER TABLE pt_tuple DROP PARTITION (202610, 'view');
```

Defaults in 25.8:

```sql
SELECT name, value FROM system.merge_tree_settings
WHERE name IN ('parts_to_delay_insert', 'parts_to_throw_insert', 'max_parts_in_total', 'old_parts_lifetime');
-- 1000, 3000, 100000, 480
SELECT value FROM system.settings WHERE name = 'max_partitions_per_insert_block';  -- 100
```

## Sources

- Custom partitioning key: <https://clickhouse.com/docs/reference/engines/table-engines/mergetree-family/custom-partitioning-key>
- Choose a low-cardinality partitioning key: <https://clickhouse.com/docs/concepts/best-practices/partitioning-keys>
- Manipulating partitions and parts (`ALTER ... PARTITION`): <https://clickhouse.com/docs/reference/statements/alter/partition>
- `max_partitions_per_insert_block`: <https://clickhouse.com/docs/reference/settings/session-settings/max-partitions>
- `parts_to_throw_insert` and related MergeTree settings: <https://clickhouse.com/docs/reference/settings/merge-tree-settings/parts-to>
- Managing data by partition (observability guide): <https://clickhouse.com/docs/guides/use-cases/observability/build-your-own/managing-data>
