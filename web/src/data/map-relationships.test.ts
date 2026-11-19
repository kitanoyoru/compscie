import { describe, expect, it } from 'vitest'

import { repositorySnapshot } from './generated/repository'
import { mapRelationships } from './map-relationships'

describe('map relationships', () => {
  it('keeps exactly the seven curated concepts in order', () => {
    expect(mapRelationships.map((relationship) => `${relationship.topic}/${relationship.concept}`)).toEqual([
      'go/Runtime',
      'go/Concurrency',
      'go/Memory',
      'go/Production diagnostics',
      'clickhouse/MergeTree storage',
      'clickhouse/Sparse indexing',
      'clickhouse/Date/time queries',
    ])
  })

  it('links every curated concept to notes that exist in the snapshot', () => {
    const paths = repositorySnapshot.notes.map((note) => note.path)

    for (const relationship of mapRelationships) {
      expect(relationship.notes.length, relationship.concept).toBeGreaterThan(0)
      for (const note of relationship.notes) {
        expect(paths, `${relationship.concept}: ${note}`).toContain(note)
      }
    }
  })
})
