import type { SolvedProblem } from '../data/types'
import { addLocalDays, dayKeyOf } from '../lib/calendar'
import type { SolveOutcome, SolveSession } from './personal-types'

/** Days until an item marked "needs review" comes back. */
export const RELEARN_DAYS = 1
/** Days until a cleanly solved item comes back: one step further after each clean solve. */
export const REVIEW_LADDER_DAYS = [3, 7, 14, 30, 60] as const
/** How far ahead the "coming up" list looks. */
export const UPCOMING_DAYS = 7

export interface ReviewAttempt {
  readonly endedAt: string
  readonly outcome: SolveOutcome
}

export interface ReviewSchedule {
  /** Viewer-local day, `YYYY-MM-DD`, on which the item is due. */
  readonly dueDay: string
  readonly intervalDays: number
  readonly lastAttempt: ReviewAttempt
}

export interface ScheduledProblem {
  readonly problem: SolvedProblem
  readonly schedule: ReviewSchedule
}

/**
 * Walks attempts oldest first. "needs-review" resets to RELEARN_DAYS. "success" climbs one step
 * of the ladder, capped at the last step. A success on the same local day as the previous
 * attempt does not climb, so cramming does not push reviews out. Undated attempts are ignored.
 */
export function scheduleFrom(attempts: readonly ReviewAttempt[]): ReviewSchedule | undefined {
  const dated = attempts
    .map((attempt) => ({ attempt, time: Date.parse(attempt.endedAt) }))
    .filter((entry) => !Number.isNaN(entry.time))
    .sort((left, right) => left.time - right.time)
  let step = -1
  let previousDay: string | undefined
  let last: { attempt: ReviewAttempt; time: number } | undefined

  for (const entry of dated) {
    const day = dayKeyOf(new Date(entry.time))

    if (entry.attempt.outcome === 'needs-review') {
      step = -1
    } else if (day !== previousDay) {
      step = Math.min(step + 1, REVIEW_LADDER_DAYS.length - 1)
    }

    previousDay = day
    last = entry
  }

  if (last === undefined) {
    return undefined
  }

  const intervalDays = step < 0 ? RELEARN_DAYS : REVIEW_LADDER_DAYS[step]!

  return {
    dueDay: dayKeyOf(addLocalDays(new Date(last.time), intervalDays)),
    intervalDays,
    lastAttempt: last.attempt,
  }
}

/** True when the item is due on or before `today` (`YYYY-MM-DD`). */
export function isDue(schedule: ReviewSchedule, today: string): boolean {
  return schedule.dueDay <= today
}

/** One schedule per problem that has at least one session. */
export function schedulesByProblem(sessions: readonly SolveSession[]): Map<number, ReviewSchedule> {
  const attempts = new Map<number, SolveSession[]>()

  for (const session of sessions) {
    const list = attempts.get(session.problemId) ?? []
    list.push(session)
    attempts.set(session.problemId, list)
  }

  const schedules = new Map<number, ReviewSchedule>()

  for (const [problemId, list] of attempts) {
    const schedule = scheduleFrom(list)

    if (schedule !== undefined) {
      schedules.set(problemId, schedule)
    }
  }

  return schedules
}

function scheduledProblems(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
): ScheduledProblem[] {
  const schedules = schedulesByProblem(sessions)

  return problems
    .flatMap((problem) => {
      const schedule = schedules.get(problem.id)
      return schedule === undefined ? [] : [{ problem, schedule }]
    })
    .sort(
      (left, right) =>
        left.schedule.dueDay.localeCompare(right.schedule.dueDay) || left.problem.id - right.problem.id,
    )
}

/**
 * Problems due today or earlier, most overdue first, then by number. Problems never practiced
 * in this workspace are not scheduled, so 600+ solved problems do not flood the queue.
 */
export function dueProblems(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
  now: Date,
): ScheduledProblem[] {
  const today = dayKeyOf(now)

  return scheduledProblems(problems, sessions).filter((item) => isDue(item.schedule, today))
}

/** Problems due after today and within UPCOMING_DAYS, soonest first. */
export function upcomingProblems(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
  now: Date,
): ScheduledProblem[] {
  const today = dayKeyOf(now)
  const horizon = dayKeyOf(addLocalDays(now, UPCOMING_DAYS))

  return scheduledProblems(problems, sessions).filter(
    (item) => item.schedule.dueDay > today && item.schedule.dueDay <= horizon,
  )
}
