# ClickHouse Lab

Small, repeatable experiments for the accompanying ClickHouse notes. The SQL
files are safe to run more than once unless a script says otherwise.

## Start the server

```sh
cd notes/clickhouse/labs
docker compose up -d
docker compose exec clickhouse clickhouse-client --user lab --password lab
```

The server is available at `localhost:8123` (HTTP) and `localhost:9000`
(native protocol). The lab credentials are `lab` / `lab`.

## Run an experiment

Pass a script to the client from inside the container:

```sh
docker compose exec clickhouse clickhouse-client \
  --user lab \
  --password lab \
  --queries-file /sql/01-date-parts.sql
```

| Script | Purpose |
| --- | --- |
| [`00-smoke-test.sql`](sql/00-smoke-test.sql) | Confirm the server and inspect a MergeTree part. |
| [`01-date-parts.sql`](sql/01-date-parts.sql) | Extract calendar and clock parts from a timestamp. |

## Reset

`docker compose down` stops the server and preserves the lab data. To remove
the data as well, run `docker compose down -v`.
