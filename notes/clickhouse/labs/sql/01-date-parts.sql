-- docker compose exec clickhouse clickhouse-client --user lab --password lab \
--   --queries-file /sql/01-date-parts.sql
--
-- Numeric accessors are useful for grouping, filtering, and partition keys.
-- dateName is useful when a human-readable label is needed.
WITH toDateTime('2026-11-17 08:18:06', 'Europe/Warsaw') AS timestamp
SELECT
    timestamp,
    toYear(timestamp) AS year,
    toQuarter(timestamp) AS quarter,
    toMonth(timestamp) AS month_number,
    dateName('month', timestamp) AS month_name,
    toDayOfMonth(timestamp) AS day_of_month,
    toDayOfYear(timestamp) AS day_of_year,
    toDayOfWeek(timestamp) AS weekday_number,
    dateName('weekday', timestamp) AS weekday_name,
    toHour(timestamp) AS hour,
    toMinute(timestamp) AS minute,
    toSecond(timestamp) AS second;
