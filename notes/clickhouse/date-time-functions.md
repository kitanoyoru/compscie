---
date: 2026-11-17
---

# ClickHouse date and time functions

> Use numeric accessors for computation and grouping; use `dateName` for labels.

## Questions this answers

- How do I extract calendar and clock parts from a ClickHouse timestamp?
- When should I use a numeric accessor versus a display label?

## Notes

- `toYear`, `toQuarter`, `toMonth`, `toDayOfMonth`, `toDayOfYear`,
  `toDayOfWeek`, `toHour`, `toMinute`, and `toSecond` return numeric parts.
  They are the useful form for predicates, aggregation keys, and ordering.
- `dateName(part, timestamp)` returns a string such as `November` or `Tuesday`.
  It is suited to result presentation, not a stable numeric key.
- Parse an input with an explicit timezone when it matters. The lab uses
  `Europe/Warsaw` so the value is unambiguous while experimenting.

## Gotchas

- `toDayOfWeek` returns Monday as `1` with its default mode. Use an explicit
  mode if another numbering convention is part of the contract.
- Keep the timestamp's timezone explicit when comparing a local wall-clock
  time with data stored or rendered in another timezone.

## Lab

Run [`labs/sql/01-date-parts.sql`](labs/sql/01-date-parts.sql) from the
[ClickHouse lab](labs/README.md):

```sh
cd notes/clickhouse/labs
docker compose exec clickhouse clickhouse-client \
  --user lab \
  --password lab \
  --queries-file /sql/01-date-parts.sql
```

## Sources

- [ClickHouse date and time functions](https://clickhouse.com/docs/sql-reference/functions/date-time-functions)
