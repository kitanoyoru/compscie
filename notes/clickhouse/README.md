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

## Courses

- [Data Warehousing with ClickHouse](courses/data-warehousing/) - ClickHouse Academy, 3 levels. In progress.

## Hands-on lab

[`labs/`](labs/) runs a local server. Every note should end with a query I actually ran there.

```sh
cd notes/clickhouse/labs
docker compose up -d
docker compose exec clickhouse clickhouse-client --user lab --password lab
```

## Roadmap

One note per item, numbered by section. Start one with `make note`; the item ticks itself on commit.

### 01 - Architecture

- [ ] `01-architecture/01-overview.md` - columnar storage, vectorized execution, what makes it fast
- [ ] `01-architecture/02-query-pipeline.md` - parser, analyzer, planner, processors
- [ ] `01-architecture/03-threads-and-memory.md` - thread pools, memory tracking, limits

### 02 - Storage: MergeTree

- [ ] `02-storage/01-parts-and-granules.md` - part layout on disk, marks, granules
- [ ] `02-storage/02-primary-key-sparse-index.md` - ORDER BY vs PRIMARY KEY, index lookups
- [ ] `02-storage/03-merges.md` - background merges, part count, "too many parts"
- [ ] `02-storage/04-mergetree-family.md` - Replacing, Summing, Aggregating, Collapsing
- [ ] `02-storage/05-compression-codecs.md` - LZ4/ZSTD, Delta, DoubleDelta, Gorilla, LowCardinality
- [ ] `02-storage/06-data-skipping-indexes.md` - minmax, set, bloom_filter
- [ ] `02-storage/07-ttl-and-tiered-storage.md` - TTL, storage policies, S3 disks

### 03 - Query performance

- [ ] `03-queries/01-explain-and-query-log.md` - EXPLAIN, `system.query_log`, profiling
- [ ] `03-queries/02-aggregation-internals.md` - hash tables, two-level aggregation, spill to disk
- [ ] `03-queries/03-joins.md` - join algorithms and when each is picked
- [ ] `03-queries/04-materialized-views.md` - insert triggers, AggregatingMergeTree targets
- [ ] `03-queries/05-projections.md` - projections vs materialized views
- [ ] `03-queries/06-dictionaries.md` - layouts, refresh, dictGet

### 04 - Writes

- [ ] `04-writes/01-insert-path.md` - batching, async inserts, insert deduplication
- [ ] `04-writes/02-mutations-and-deletes.md` - ALTER mutations, lightweight deletes and updates
- [ ] `04-writes/03-integration-engines.md` - Kafka, S3, table functions

### 05 - Distributed

- [ ] `05-distributed/01-replication-keeper.md` - ReplicatedMergeTree, ClickHouse Keeper
- [ ] `05-distributed/02-sharding.md` - Distributed engine, sharding keys
- [ ] `05-distributed/03-parallel-replicas.md` - parallel replicas, SharedMergeTree in Cloud

### 06 - Operations

- [ ] `06-operations/01-system-tables.md` - parts, merges, mutations, metrics
- [ ] `06-operations/02-backups.md` - BACKUP/RESTORE, freezing parts
- [ ] `06-operations/03-production-gotchas.md` - lessons collected along the way

## Resources

- Official docs: <https://clickhouse.com/docs>
- Source code: <https://github.com/ClickHouse/ClickHouse>
- Examples: <https://github.com/ClickHouse/examples>
- Paper: _ClickHouse - Lightning Fast Analytics for Everyone_ (VLDB 2024)

## Log

<!-- Appended by the pre-commit hook. -->

- 2026-10-18 - Started. Set up the topic and the local lab.
- 2026-10-18 - Started the Data Warehousing with ClickHouse course, Level 1.
- 2026-10-18 - Added [01 - Introduction to ClickHouse](courses/data-warehousing/level-1/01-introduction.md)
- 2026-10-18 - Added [02 - Deep Dive into ClickHouse Architecture](courses/data-warehousing/level-1/02-architecture.md)
- 2026-10-18 - Added [03 - Inserting Data into ClickHouse](courses/data-warehousing/level-1/03-inserting-data.md)
