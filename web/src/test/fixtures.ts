import { repositorySnapshot } from '../data/generated/repository'
import type { PersonalLearningState } from '../domain/personal-types'
import { STORAGE_KEY } from '../state/storage'

/**
 * Reference "now" for seeded state: Thursday 10:00 in America/Los_Angeles.
 * Every fixture timestamp falls in ISO week 2026-11-16..22 in both UTC and
 * America/Los_Angeles and is not later than this instant.
 *
 * Tests asserting on week, streak or "today" content must pin the clock:
 * `vi.useFakeTimers({ toFake: ['Date'] })` + `vi.setSystemTime(FIXTURE_NOW)`,
 * and call `vi.useRealTimers()` in `afterEach`.
 */
export const FIXTURE_NOW = new Date('2026-11-19T18:00:00.000Z')

export function seededState(): PersonalLearningState {
  const [first, second] = repositorySnapshot.problems
  if (!first || !second) throw new Error('fixtures need at least two solved problems in the snapshot')

  return {
    version: 1,
    tasks: [
      {
        id: 'task-open',
        title: 'Read the Go scheduler notes',
        topicId: 'go',
        estimatedMinutes: 30,
        status: 'open',
        createdAt: '2026-11-16T09:00:00.000Z',
      },
      {
        id: 'task-deferred',
        title: 'Review ClickHouse merge trees',
        topicId: 'clickhouse',
        estimatedMinutes: 45,
        status: 'deferred',
        createdAt: '2026-11-17T09:00:00.000Z',
      },
      {
        id: 'task-completed',
        title: 'Finish the Go channels lab',
        topicId: 'go',
        estimatedMinutes: 20,
        status: 'completed',
        createdAt: '2026-11-18T09:00:00.000Z',
        completedAt: '2026-11-19T10:00:00.000Z',
      },
    ],
    sessions: [
      {
        problemId: first.id,
        startedAt: '2026-11-18T12:00:00.000Z',
        endedAt: '2026-11-18T12:40:00.000Z',
        outcome: 'needs-review',
        reflection: 'Missed the edge case with empty input.',
      },
      {
        problemId: second.id,
        startedAt: '2026-11-19T12:00:00.000Z',
        endedAt: '2026-11-19T12:25:00.000Z',
        outcome: 'success',
      },
    ],
  }
}

export function seedLearningState(state: PersonalLearningState = seededState()): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
