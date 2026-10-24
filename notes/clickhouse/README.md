---
title: ClickHouse
status: active
started: 2026-10-18
---

# ClickHouse

<!-- status: planned | active | paused | done. The root README reads the block above. -->

## Why I'm learning this

- Understand ClickHouse internals well enough to design schemas and debug slow queries from first principles, not from folklore.
- Know which knobs matter in production: ordering keys, merges, parts, memory, replication.

## Hands-on lab

[`labs/`](labs/) runs a local server. Every note should end with a query I actually ran there.

```sh
cd notes/clickhouse/labs
docker compose up -d
docker compose exec clickhouse clickhouse-client --user lab --password lab
```

## Resources

- Official docs: <https://clickhouse.com/docs>
- Source code: <https://github.com/ClickHouse/ClickHouse>
- Examples: <https://github.com/ClickHouse/examples>
- Paper: _ClickHouse - Lightning Fast Analytics for Everyone_ (VLDB 2024)
- Course: [Data Warehousing with ClickHouse](https://learn.clickhouse.com/data-warehousing-with-clickhouse-1/569044) - ClickHouse Academy, 3 levels (needs an Academy login). Path overview: <https://clickhouse.com/learn/data-warehousing>

## Notes

One file per note, flat in this folder. Start one with `make note TOPIC=clickhouse NOTE=<slug>`; the list below rebuilds on commit.

<!-- notes:start - generated, newest first -->

- 2026-10-24 - [ClickHouse Data Part](data-part.md)
- 2026-10-24 - [ClickHouse Granule](granule.md)

<!-- notes:end -->
