import { describe, expect, it } from 'vitest'

import type { SolvedProblem } from '../data/types'
import {
  activityStreak,
  completionsByDayThisIsoWeek,
  countSessionsThisIsoWeek,
  difficultyCounts,
  latestSessionByProblem,
  problemProgress,
  rankCounts,
  recentReflections,
  reviewQueue,
  sessionMinutes,
  sessionsForProblem,
} from './insights'
import type { LearningTask, SolveSession } from './personal-types'

// Thursday of the ISO week Monday 2026-11-16 .. Sunday 2026-11-22.
const now = new Date('2026-11-19T12:00:00.000Z')

function completedTask(id: string, completedAt: string): LearningTask {
  return { id, title: `Task ${id}`, status: 'completed', createdAt: '2026-11-01T00:00:00.000Z', completedAt }
}

function session(
  problemId: number,
  endedAt: string,
  outcome: SolveSession['outcome'] = 'success',
  reflection?: string,
): SolveSession {
  return { problemId, startedAt: endedAt, endedAt, outcome, reflection }
}

function problem(id: number, overrides: Partial<SolvedProblem> = {}): SolvedProblem {
  return {
    id,
    title: `Problem ${id}`,
    difficulty: 'easy',
    languages: ['Go'],
    tags: ['Array'],
    path: `leetcode/easy/${id}`,
    ...overrides,
  }
}

describe('weekly activity', () => {
  it('counts completed tasks per day of the current ISO week', () => {
    const days = completionsByDayThisIsoWeek(
      [
        completedTask('a', '2026-11-16T08:00:00.000Z'),
        completedTask('b', '2026-11-19T08:00:00.000Z'),
        completedTask('c', '2026-11-19T20:00:00.000Z'),
        completedTask('previous-week', '2026-11-15T23:59:59.000Z'),
        { id: 'open', title: 'Open', status: 'open', createdAt: '2026-11-19T08:00:00.000Z' },
      ],
      now,
    )

    expect(days.map((day) => day.date)).toEqual([
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
      '2026-11-19',
      '2026-11-20',
      '2026-11-21',
      '2026-11-22',
    ])
    expect(days.map((day) => day.count)).toEqual([1, 0, 0, 2, 0, 0, 0])
  })

  it('counts sessions by the local ISO week boundaries', () => {
    expect(
      countSessionsThisIsoWeek(
        [
          session(1, '2026-11-16T07:59:59.000Z'), // Sun 23:59:59 PST, previous week: out
          session(2, '2026-11-16T08:00:00.000Z'), // Mon 00:00 PST: in
          session(3, '2026-11-23T07:59:59.000Z'), // Sun 23:59:59 PST: in
          session(4, '2026-11-23T08:00:00.000Z'), // next Mon 00:00 PST: out
          session(5, 'bad'), // out
        ],
        now,
      ),
    ).toBe(2)
  })

  it('measures a streak that stays alive until today ends', () => {
    const tasks = [completedTask('a', '2026-11-17T10:00:00.000Z')]
    const sessions = [session(1, '2026-11-18T10:00:00.000Z')]

    expect(activityStreak(tasks, sessions, now)).toBe(2)
    expect(activityStreak(tasks, [...sessions, session(2, '2026-11-19T09:00:00.000Z')], now)).toBe(3)
    expect(activityStreak(tasks, [], now)).toBe(0)
  })

  it('counts a late-evening local session on its local day', () => {
    // 2026-11-19T06:00:00Z is Wednesday 22:00 PST, so Wednesday, not Thursday.
    const thursdayMorning = new Date('2026-11-19T18:00:00.000Z')
    const sessions = [session(1, '2026-11-19T06:00:00.000Z')]

    expect(activityStreak([], sessions, thursdayMorning)).toBe(1)
    expect(activityStreak([], sessions, new Date('2026-11-21T18:00:00.000Z'))).toBe(0)
    expect(
      completionsByDayThisIsoWeek([completedTask('late', '2026-11-19T06:00:00.000Z')], thursdayMorning).map(
        (day) => day.count,
      ),
    ).toEqual([0, 0, 1, 0, 0, 0, 0])
  })
})

describe('practice history', () => {
  const sessions = [
    session(1, '2026-11-10T10:00:00.000Z', 'needs-review', 'Use a hash map.'),
    session(1, '2026-11-12T10:00:00.000Z', 'success', '  '),
    session(2, '2026-11-11T10:00:00.000Z', 'needs-review', 'Mind the carry.'),
    session(3, '2026-11-13T10:00:00.000Z', 'needs-review'),
  ]

  it('keeps the latest session per problem', () => {
    const latest = latestSessionByProblem(sessions)

    expect(problemProgress(1, latest)).toBe('success')
    expect(problemProgress(2, latest)).toBe('needs-review')
    expect(problemProgress(4, latest)).toBe('new')
  })

  it('queues problems whose latest outcome needs review, most recent first', () => {
    const queue = reviewQueue([problem(1), problem(2), problem(3), problem(4)], sessions)

    expect(queue.map((item) => item.problem.id)).toEqual([3, 2])
  })

  it('lists sessions for one problem and recent non-empty reflections', () => {
    expect(sessionsForProblem(sessions, 1).map((item) => item.endedAt)).toEqual([
      '2026-11-12T10:00:00.000Z',
      '2026-11-10T10:00:00.000Z',
    ])
    expect(recentReflections(sessions, 5).map((item) => item.reflection)).toEqual([
      'Mind the carry.',
      'Use a hash map.',
    ])
  })

  it('reports whole minutes only for timed sessions', () => {
    expect(
      sessionMinutes({ ...session(1, '2026-11-12T10:25:20.000Z'), startedAt: '2026-11-12T10:00:00.000Z' }),
    ).toBe(25)
    expect(sessionMinutes(session(1, '2026-11-12T10:00:00.000Z'))).toBeUndefined()
  })
})

describe('repository aggregates', () => {
  it('ranks counts by frequency, then alphabetically', () => {
    expect(rankCounts(['Go', 'Rust', 'Go', 'C', 'Rust', 'Go'])).toEqual([
      { label: 'Go', count: 3 },
      { label: 'Rust', count: 2 },
      { label: 'C', count: 1 },
    ])
  })

  it('counts problems per difficulty', () => {
    expect(
      difficultyCounts([problem(1), problem(2, { difficulty: 'hard' }), problem(3, { difficulty: 'easy' })]),
    ).toEqual({ easy: 2, medium: 0, hard: 1 })
  })
})
