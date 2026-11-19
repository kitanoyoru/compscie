import { repositorySnapshot } from '../data/generated/repository'
import type { PersonalLearningState } from '../domain/personal-types'
import { STORAGE_KEY } from '../state/storage'

export function seededState(): PersonalLearningState {
  const [first, second] = repositorySnapshot.problems

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
