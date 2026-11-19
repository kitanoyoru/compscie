import { describe, expect, it } from 'vitest'

import type { RepositorySnapshot, SolvedProblem, TopicSummary } from '../data/types'
import { FILTER_ALL, filterProblems } from './recommendations'
import type { LearningTask, PersonalLearningState, SolveSession } from './personal-types'
import { choosePracticeProblem, countCompletedThisIsoWeek, getTodayRecommendation } from './recommendations'

const goTopic: TopicSummary = {
  slug: 'go',
  title: 'Go',
  status: 'active',
  focus: 'Runtime internals',
  next: 'Study the scheduler',
  started: '2026-08-23',
  lastNote: '2026-08-23',
  noteCount: 1,
  concepts: [],
}

const clickhouseTopic: TopicSummary = {
  slug: 'clickhouse',
  title: 'ClickHouse',
  status: 'active',
  focus: 'MergeTree internals',
  next: 'Run the date-parts lab',
  started: '2026-10-18',
  lastNote: '2026-11-17',
  noteCount: 1,
  concepts: [],
}

const snapshot = {
  generatedAt: '2026-11-17T00:00:00.000Z',
  topics: [clickhouseTopic, goTopic],
  notes: [],
  problems: [],
  counts: { topics: 2, notes: 0, solvedProblems: 0, languages: [] },
} satisfies RepositorySnapshot

function task(overrides: Partial<LearningTask> & Pick<LearningTask, 'id' | 'createdAt'>): LearningTask {
  return {
    title: `Task ${overrides.id}`,
    status: 'open',
    ...overrides,
  }
}

describe('getTodayRecommendation', () => {
  it('prefers the earliest open task over deferred tasks and topic fallbacks', () => {
    const state: PersonalLearningState = {
      version: 1,
      tasks: [
        task({ id: 'deferred', createdAt: '2026-11-01T09:00:00.000Z', status: 'deferred' }),
        task({ id: 'open-later', createdAt: '2026-11-03T09:00:00.000Z' }),
        task({ id: 'open-first', createdAt: '2026-11-02T09:00:00.000Z' }),
      ],
      sessions: [],
    }

    expect(getTodayRecommendation(snapshot, state)).toMatchObject({
      kind: 'task',
      taskId: 'open-first',
    })
  })

  it('uses a deferred task before topic fallbacks', () => {
    const state: PersonalLearningState = {
      version: 1,
      tasks: [task({ id: 'deferred', createdAt: '2026-11-02T09:00:00.000Z', status: 'deferred' })],
      sessions: [],
    }

    expect(getTodayRecommendation(snapshot, state)).toMatchObject({
      kind: 'task',
      taskId: 'deferred',
    })
  })

  it('falls back to the active topic with the oldest note, then slug', () => {
    expect(getTodayRecommendation(snapshot, { version: 1, tasks: [], sessions: [] })).toMatchObject({
      kind: 'topic',
      topicSlug: 'go',
    })
  })
})

describe('countCompletedThisIsoWeek', () => {
  it('starts a new ISO week on Monday', () => {
    const tasks = [
      task({
        id: 'sunday',
        createdAt: '2026-11-01T09:00:00.000Z',
        status: 'completed',
        completedAt: '2026-11-15T23:00:00.000Z',
      }),
      task({
        id: 'monday',
        createdAt: '2026-11-01T09:00:00.000Z',
        status: 'completed',
        completedAt: '2026-11-16T09:00:00.000Z',
      }),
      task({ id: 'open', createdAt: '2026-11-16T10:00:00.000Z' }),
    ]

    expect(countCompletedThisIsoWeek(tasks, new Date('2026-11-16T09:00:00Z'))).toBe(1)
  })

  it('counts a Sunday-evening completion in the week it happened locally', () => {
    const tasks = [
      task({
        id: 'late-sunday',
        createdAt: '2026-11-01T09:00:00.000Z',
        status: 'completed',
        completedAt: '2026-11-16T05:00:00.000Z', // Sunday 21:00 PST
      }),
    ]

    expect(countCompletedThisIsoWeek(tasks, new Date('2026-11-17T18:00:00Z'))).toBe(0)
  })
})

describe('choosePracticeProblem', () => {
  const problems: SolvedProblem[] = [
    { id: 3, title: 'Third', difficulty: 'medium', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/medium/0003' },
    { id: 2, title: 'Second', difficulty: 'medium', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/medium/0002' },
    { id: 1, title: 'First', difficulty: 'easy', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/easy/0001' },
  ]

  function session(
    problemId: number,
    endedAt: string,
    outcome: SolveSession['outcome'],
  ): SolveSession {
    return {
      problemId,
      startedAt: '2026-11-01T09:00:00.000Z',
      endedAt,
      outcome,
    }
  }

  it('ranks the latest needs-review problem first', () => {
    const sessions = [
      session(1, '2026-11-10T09:00:00.000Z', 'needs-review'),
      session(2, '2026-11-12T09:00:00.000Z', 'needs-review'),
      session(3, '2026-11-11T09:00:00.000Z', 'success'),
    ]

    expect(choosePracticeProblem(problems, sessions)?.id).toBe(2)
  })

  it('ranks never-practiced before least-recently completed, then by id', () => {
    const sessions = [
      session(2, '2026-11-12T09:00:00.000Z', 'success'),
      session(1, '2026-11-10T09:00:00.000Z', 'success'),
    ]

    expect(choosePracticeProblem(problems, sessions)?.id).toBe(3)
    expect(choosePracticeProblem([problems[1]!, problems[2]!], sessions)?.id).toBe(1)
    expect(choosePracticeProblem([problems[0]!, problems[2]!], sessions)?.id).toBe(3)
  })
})

describe('filterProblems', () => {
  it('intersects difficulty, language, and tag filters', () => {
    const problems: SolvedProblem[] = [
      {
        id: 1,
        title: 'One',
        difficulty: 'easy',
        languages: ['Go', 'TypeScript'],
        solutions: [],
        tags: ['Array'],
        path: 'leetcode/easy/0001',
      },
      {
        id: 2,
        title: 'Two',
        difficulty: 'medium',
        languages: ['Go'],
        solutions: [],
        tags: ['Array', 'Sliding Window'],
        path: 'leetcode/medium/0002',
      },
      {
        id: 3,
        title: 'Three',
        difficulty: 'medium',
        languages: ['TypeScript'],
        solutions: [],
        tags: ['Array'],
        path: 'leetcode/medium/0003',
      },
    ]

    expect(
      filterProblems(problems, { difficulty: 'medium', language: 'Go', tag: 'Sliding Window' }).map(
        (problem) => problem.id,
      ),
    ).toEqual([2])
    expect(
      filterProblems(problems, { difficulty: FILTER_ALL, language: FILTER_ALL, tag: FILTER_ALL }),
    ).toHaveLength(3)
  })
})

describe('filterProblems query', () => {
  const problems: SolvedProblem[] = [
    { id: 1, title: 'Two Sum', difficulty: 'easy', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/easy/0001' },
    { id: 15, title: '3Sum', difficulty: 'medium', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/medium/0015' },
    { id: 167, title: 'Two Sum II', difficulty: 'medium', languages: ['Go'], solutions: [], tags: [], path: 'leetcode/medium/0167' },
  ]

  it('matches a case-insensitive title substring', () => {
    expect(filterProblems(problems, { query: '  two SUM ' }).map((problem) => problem.id)).toEqual([1, 167])
  })

  it('matches a problem number prefix, with or without a leading #', () => {
    expect(filterProblems(problems, { query: '1' }).map((problem) => problem.id)).toEqual([1, 15, 167])
    expect(filterProblems(problems, { query: '#16' }).map((problem) => problem.id)).toEqual([167])
  })

  it('combines the query with the other filters', () => {
    expect(filterProblems(problems, { query: 'sum', difficulty: 'medium' }).map((problem) => problem.id)).toEqual([
      15, 167,
    ])
  })
})
