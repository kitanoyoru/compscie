-- docker compose exec clickhouse clickhouse-client --user lab --password lab --queries-file /sql/00-smoke-test.sql
SELECT version();

CREATE TABLE IF NOT EXISTS smoke
(
    id UInt64,
    created DateTime
)
ENGINE = MergeTree
ORDER BY id;

INSERT INTO smoke SELECT number, now() - number FROM numbers(1000000);

SELECT count(), min(created), max(created) FROM smoke;

-- Parts are the unit everything else in MergeTree builds on.
SELECT name, rows, marks, formatReadableSize(bytes_on_disk) AS size
FROM system.parts
WHERE table = 'smoke' AND active;
