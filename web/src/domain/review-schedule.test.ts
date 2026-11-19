import { describe, expect, it } from 'vitest'

import type { SolvedProblem } from '../data/types'
import type { SolveOutcome, SolveSession } from './personal-types'
import {
  REVIEW_LADDER_DAYS,
  dueProblems,
  isDue,
  scheduleFrom,
  upcomingProblems,
  type ReviewAttempt,
} from './review-schedule'

// Vitest's global setup pins TZ to America/Los_Angeles (UTC-8 in November, UTC-7 before Nov 1).
function attempt(endedAt: string, outcome: SolveOutcome = 'success'): ReviewAttempt {
  return { endedAt, outcome }
}

function session(problemId: number, endedAt: string, outcome: SolveOutcome = 'success'): SolveSession {
  return { problemId, startedAt: endedAt, endedAt, outcome }
}

function problem(id: number): SolvedProblem {
  return {
    id,
    title: `Problem ${id}`,
    difficulty: 'easy',
    languages: ['Go'],
    solutions: [{ language: 'Go', file: 'main.go' }],
    tags: [],
    path: `leetcode/easy/${id}`,
  }
}

describe('scheduleFrom', () => {
  it('has nothing to schedule without dated attempts', () => {
    expect(scheduleFrom([])).toBeUndefined()
    expect(scheduleFrom([attempt('not a date')])).toBeUndefined()
  })

  it('brings a first clean solve back after 3 days', () => {
    expect(scheduleFrom([attempt('2026-11-19T18:00:00Z')])).toMatchObject({ dueDay: '2026-11-22', intervalDays: 3 })
  })

  it('climbs one step per clean solve on a new day', () => {
    const schedule = scheduleFrom([attempt('2026-11-19T18:00:00Z'), attempt('2026-11-10T18:00:00Z')])

    expect(schedule).toMatchObject({ dueDay: '2026-11-26', intervalDays: 7 })
    expect(schedule?.lastAttempt.endedAt).toBe('2026-11-19T18:00:00Z')
  })

  it('relearns after "needs review": back the next day', () => {
    expect(
      scheduleFrom([attempt('2026-11-10T18:00:00Z'), attempt('2026-11-19T18:00:00Z', 'needs-review')]),
    ).toMatchObject({ dueDay: '2026-11-20', intervalDays: 1 })
  })

  it('does not climb for a second clean solve on the same local day', () => {
    expect(scheduleFrom([attempt('2026-11-19T16:00:00Z'), attempt('2026-11-19T20:00:00Z')])).toMatchObject({
      dueDay: '2026-11-22',
      intervalDays: 3,
    })
    expect(
      scheduleFrom([attempt('2026-11-19T16:00:00Z', 'needs-review'), attempt('2026-11-19T20:00:00Z')]),
    ).toMatchObject({ dueDay: '2026-11-20', intervalDays: 1 })
  })

  it('caps the ladder at its last step', () => {
    const days = Array.from({ length: REVIEW_LADDER_DAYS.length + 2 }, (_, index) =>
      attempt(`2026-0${index + 1}-15T18:00:00Z`),
    )

    expect(scheduleFrom(days)?.intervalDays).toBe(REVIEW_LADDER_DAYS.at(-1))
  })

  it('counts a late-evening session on its local day, not its UTC day', () => {
    // 23:30 on Nov 19 in Los Angeles is already Nov 20 in UTC.
    expect(scheduleFrom([attempt('2026-11-20T07:30:00Z')])?.dueDay).toBe('2026-11-22')
  })

  it('lands on the right calendar day across the end of daylight saving time', () => {
    // Oct 30, 11:00 PDT plus 3 days crosses Nov 1, when clocks fall back.
    expect(scheduleFrom([attempt('2026-10-30T18:00:00Z')])?.dueDay).toBe('2026-11-02')
  })
})

describe('isDue', () => {
  const schedule = scheduleFrom([attempt('2026-11-19T18:00:00Z')])!

  it('is due on and after its due day only', () => {
    expect(isDue(schedule, '2026-11-21')).toBe(false)
    expect(isDue(schedule, '2026-11-22')).toBe(true)
    expect(isDue(schedule, '2026-12-01')).toBe(true)
  })
})

describe('due and upcoming problems', () => {
  const now = new Date('2026-11-19T18:00:00Z')
  const problems = [problem(1), problem(2), problem(3), problem(4), problem(5)]
  const sessions = [
    session(1, '2026-11-10T18:00:00Z'), // due Nov 13: six days overdue
    session(2, '2026-11-18T18:00:00Z', 'needs-review'), // due Nov 19: today
    session(3, '2026-11-18T18:00:00Z'), // due Nov 21: upcoming
    session(5, '2026-11-01T18:00:00Z'),
    session(5, '2026-11-05T18:00:00Z'), // due Nov 12: seven days overdue
    session(99, '2026-11-01T18:00:00Z'), // not in the repository
  ]

  it('lists due problems most overdue first and skips problems never practiced', () => {
    expect(dueProblems(problems, sessions, now).map((item) => [item.problem.id, item.schedule.dueDay])).toEqual([
      [5, '2026-11-12'],
      [1, '2026-11-13'],
      [2, '2026-11-19'],
    ])
  })

  it('lists problems coming up within a week, soonest first', () => {
    expect(upcomingProblems(problems, sessions, now).map((item) => item.problem.id)).toEqual([3])

    // Third clean solve: 14 days out, past the one-week window.
    const later = [
      session(3, '2026-10-20T18:00:00Z'),
      session(3, '2026-11-01T18:00:00Z'),
      session(3, '2026-11-19T18:00:00Z'),
    ]
    expect(upcomingProblems(problems, later, now)).toEqual([])
  })
})
