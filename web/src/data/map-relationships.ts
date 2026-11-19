export interface TopicRelationship {
  readonly topic: string
  readonly concept: string
  /** Repository paths of the notes that belong to this concept, curated by hand. */
  readonly notes: readonly string[]
}

export const mapRelationships: readonly TopicRelationship[] = [
  {
    topic: 'go',
    concept: 'Runtime',
    notes: [
      'notes/go/scheduler-gmp.md',
      'notes/go/timers-tickers.md',
      'notes/go/defer.md',
      'notes/go/deadlock-detector.md',
    ],
  },
  {
    topic: 'go',
    concept: 'Concurrency',
    notes: [
      'notes/go/channels.md',
      'notes/go/mutex.md',
      'notes/go/rwmutex.md',
      'notes/go/waitgroup.md',
      'notes/go/context.md',
      'notes/go/memory-model.md',
    ],
  },
  {
    topic: 'go',
    concept: 'Memory',
    notes: [
      'notes/go/memory-allocator.md',
      'notes/go/garbage-collector.md',
      'notes/go/escape-analysis-gc-tuning.md',
      'notes/go/slices.md',
      'notes/go/maps-legacy-buckets.md',
      'notes/go/maps-swiss-tables.md',
    ],
  },
  {
    topic: 'go',
    concept: 'Production diagnostics',
    notes: [
      'notes/go/deadlock-detector.md',
      'notes/go/escape-analysis-gc-tuning.md',
      'notes/go/garbage-collector.md',
    ],
  },
  {
    topic: 'clickhouse',
    concept: 'MergeTree storage',
    notes: [
      'notes/clickhouse/data-part.md',
      'notes/clickhouse/granule.md',
      'notes/clickhouse/primary-key-vs-order-by.md',
      'notes/clickhouse/partitioning.md',
    ],
  },
  {
    topic: 'clickhouse',
    concept: 'Sparse indexing',
    notes: [
      'notes/clickhouse/sparse-index.md',
      'notes/clickhouse/granule.md',
      'notes/clickhouse/primary-key-vs-order-by.md',
    ],
  },
  {
    topic: 'clickhouse',
    concept: 'Date/time queries',
    notes: ['notes/clickhouse/date-time-functions.md'],
  },
]
