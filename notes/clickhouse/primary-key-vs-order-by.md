---
date: 2026-10-24
---

# ClickHouse PRIMARY KEY vs ORDER BY

> `ORDER BY` decides how rows are sorted inside each data part. `PRIMARY KEY` decides which of those columns go into the sparse index. By default they are the same; when both are set, the primary key must be a prefix of the sorting key.

## Questions this answers

- What does each clause control in a MergeTree table?
- When is it worth setting them differently?
- Does the primary key enforce uniqueness?
- What can be changed later with `ALTER`?

## Notes

### What each one does

| | `ORDER BY` (sorting key) | `PRIMARY KEY` |
| --- | --- | --- |
| Controls | Physical sort order of rows inside every part | Contents of the sparse index (`primary.cidx`), one entry per granule (8192 rows) |
| Required | Yes (`ORDER BY tuple()` for no sorting) | No, defaults to `ORDER BY` |
| Constraint | - | Must be a prefix of `ORDER BY` |
| Used by merge engines | Yes: `SummingMergeTree`, `ReplacingMergeTree`, `AggregatingMergeTree`, `CollapsingMergeTree` collapse rows with equal sorting key | No |
| Changeable later | Partly, see below | No |

See [data-part.md](data-part.md) for how granules, marks and the primary index fit together.

### Not a uniqueness constraint

The primary key in ClickHouse is only an index for skipping granules. Duplicate keys are stored as separate rows. If you need one row per key, use `ReplacingMergeTree` and read with `FINAL` or `argMax`, and remember deduplication happens only at merge time.

### Why set them differently

Sort by more columns than you index:

```sql
CREATE TABLE events
(
    tenant_id UInt32,
    ts        DateTime,
    user_id   UInt64,
    value     Float64
)
ENGINE = SummingMergeTree
PRIMARY KEY (tenant_id, ts)
ORDER BY (tenant_id, ts, user_id);
```

- **Small index.** The index holds only `(tenant_id, ts)`. It is loaded into memory for every part, so fewer and narrower key columns cost less RAM.
- **Better compression.** Extra sort columns put similar values next to each other inside a part.
- **Collapsing key.** Merge engines group by the sorting key. Here rows are summed per `(tenant_id, ts, user_id)`, while the index skips data only by `(tenant_id, ts)`.
- **Room to evolve.** The primary key is fixed, but the sorting key can still grow (see below).

Extra trailing columns in the index rarely help queries: the index can only narrow granules on a prefix of the key, and later columns are useful only once the earlier ones are fixed.

### Changing them with ALTER

- `ALTER TABLE ... MODIFY ORDER BY` can:
  - append columns **added in the same `ALTER`** (`ADD COLUMN x ..., MODIFY ORDER BY (..., x)`). Old rows have the default value, so existing parts stay sorted;
  - drop columns from the end, as long as the primary key is still a prefix.
- It cannot add an existing column. That would require re-sorting existing parts.
- There is no `MODIFY PRIMARY KEY`. To change the primary key, create a new table and `INSERT INTO new SELECT * FROM old`.
- It is a metadata-only change: existing parts are not rewritten.

### Rule of thumb

- Put in `PRIMARY KEY` only the leading columns your queries filter on, from low to high cardinality.
- Add columns after them in `ORDER BY` when they help compression or define the collapsing key.

## Gotchas

- `PRIMARY KEY (b) ORDER BY (a, b)` fails: the primary key must be a prefix, not just a subset.
- In `SummingMergeTree` the sorting key, not the primary key, decides which rows are summed. Leaving a column out of `ORDER BY` collapses it away.
- A `PRIMARY KEY` clause without `ORDER BY` makes the sorting key equal to it. Writing both only matters when they differ.

## Open questions

- How much memory does `primary.cidx` really take on a big table (`system.parts.primary_key_bytes_in_memory`)?
- When do projections or skip indexes beat a second table with another sorting key?

## Lab

Run against `labs/` (ClickHouse 25.8).

```sql
CREATE TABLE pk_demo (tenant_id UInt32, ts DateTime, user_id UInt64, value Float64)
ENGINE = SummingMergeTree PRIMARY KEY (tenant_id, ts) ORDER BY (tenant_id, ts, user_id);

SELECT sorting_key, primary_key FROM system.tables WHERE name = 'pk_demo';
-- tenant_id, ts, user_id │ tenant_id, ts

INSERT INTO pk_demo VALUES
    (1, '2026-10-24 00:00:00', 7, 1),
    (1, '2026-10-24 00:00:00', 7, 2),
    (1, '2026-10-24 00:00:00', 8, 5);
OPTIMIZE TABLE pk_demo FINAL;
SELECT * FROM pk_demo ORDER BY user_id;
-- 1 │ 2026-10-24 00:00:00 │ 7 │ 3   <- summed per sorting key
-- 1 │ 2026-10-24 00:00:00 │ 8 │ 5

-- append a new column: works
ALTER TABLE pk_demo ADD COLUMN region LowCardinality(String),
    MODIFY ORDER BY (tenant_id, ts, user_id, region);

-- append an existing column: fails
ALTER TABLE pk_demo MODIFY ORDER BY (tenant_id, ts, user_id, region, value);
-- Existing column ... is used in the expression that was added to the sorting key

-- primary key not a prefix: fails
CREATE TABLE bad (a UInt8, b UInt8) ENGINE = MergeTree PRIMARY KEY (b) ORDER BY (a, b);
-- Primary key must be a prefix of the sorting key, but the column in the position 0 is a, not b. (BAD_ARGUMENTS)

-- duplicates are kept
CREATE TABLE dup (a UInt8) ENGINE = MergeTree ORDER BY a;
INSERT INTO dup SELECT 1 FROM numbers(2);
SELECT count() FROM dup;
-- 2
```

## Sources

- MergeTree, "Choosing a primary key that differs from the sorting key": <https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree>
- Manipulating key expressions (`MODIFY ORDER BY`): <https://clickhouse.com/docs/sql-reference/statements/alter/order-by>
- Primary indexes guide: <https://clickhouse.com/docs/guides/best-practices/sparse-primary-indexes>
