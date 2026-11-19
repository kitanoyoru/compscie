import type { Difficulty, SolvedProblem } from '../data/types'
import type { LearningTask, SolveSession, SolveOutcome } from './personal-types'
import { addLocalDays, localDayKey } from '../lib/calendar'
import { getIsoWeekStart } from './recommendations'

export interface DayCount {
  /** Viewer-local calendar day, `YYYY-MM-DD`. */
  readonly date: string
  readonly count: number
}

export interface RankedCount {
  readonly label: string
  readonly count: number
}

export interface ReviewItem {
  readonly problem: SolvedProblem
  readonly session: SolveSession
}

export type ProblemProgress = 'new' | SolveOutcome

function isInIsoWeek(value: string, now: Date): boolean {
  const time = Date.parse(value)
  const weekStart = getIsoWeekStart(now)

  return !Number.isNaN(time) && time >= weekStart.getTime() && time < addLocalDays(weekStart, 7).getTime()
}

/** Completed tasks per day for the ISO week (Monday to Sunday, viewer-local) that contains `now`. */
export function completionsByDayThisIsoWeek(tasks: readonly LearningTask[], now: Date): DayCount[] {
  const weekStart = getIsoWeekStart(now)
  const counts = new Map<string, number>()

  for (const task of tasks) {
    const day = task.status === 'completed' && task.completedAt ? localDayKey(task.completedAt) : undefined

    if (day !== undefined) {
      counts.set(day, (counts.get(day) ?? 0) + 1)
    }
  }

  return Array.from({ length: 7 }, (_, offset) => {
    const date = localDayKey(addLocalDays(weekStart, offset)) ?? ''

    return { date, count: counts.get(date) ?? 0 }
  })
}

export function countSessionsThisIsoWeek(sessions: readonly SolveSession[], now: Date): number {
  return sessions.filter((session) => isInIsoWeek(session.endedAt, now)).length
}

/**
 * Consecutive viewer-local days with at least one completed task or practice session.
 * A streak stays alive through today until the day ends, so it counts back from
 * yesterday when there is no activity yet today.
 */
export function activityStreak(
  tasks: readonly LearningTask[],
  sessions: readonly SolveSession[],
  now: Date,
): number {
  const activeDays = new Set<string>()

  for (const task of tasks) {
    const day = task.status === 'completed' && task.completedAt ? localDayKey(task.completedAt) : undefined

    if (day !== undefined) {
      activeDays.add(day)
    }
  }

  for (const session of sessions) {
    const day = localDayKey(session.endedAt)

    if (day !== undefined) {
      activeDays.add(day)
    }
  }

  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (!activeDays.has(localDayKey(cursor) ?? '')) {
    cursor = addLocalDays(cursor, -1)
  }

  let streak = 0

  while (activeDays.has(localDayKey(cursor) ?? '')) {
    streak += 1
    cursor = addLocalDays(cursor, -1)
  }

  return streak
}

function byEndedAtDescending(left: SolveSession, right: SolveSession): number {
  const leftTime = Date.parse(left.endedAt)
  const rightTime = Date.parse(right.endedAt)

  return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime)
}

export function latestSessionByProblem(sessions: readonly SolveSession[]): Map<number, SolveSession> {
  const latest = new Map<number, SolveSession>()

  for (const session of [...sessions].sort(byEndedAtDescending)) {
    if (!latest.has(session.problemId)) {
      latest.set(session.problemId, session)
    }
  }

  return latest
}

export function problemProgress(
  problemId: number,
  latestSessions: ReadonlyMap<number, SolveSession>,
): ProblemProgress {
  return latestSessions.get(problemId)?.outcome ?? 'new'
}

/** Problems whose most recent session was marked "needs review", most recent first. */
export function reviewQueue(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
): ReviewItem[] {
  const latest = latestSessionByProblem(sessions)

  return problems
    .flatMap((problem) => {
      const session = latest.get(problem.id)

      return session?.outcome === 'needs-review' ? [{ problem, session }] : []
    })
    .sort((left, right) => byEndedAtDescending(left.session, right.session))
}

export function sessionsForProblem(sessions: readonly SolveSession[], problemId: number): SolveSession[] {
  return sessions.filter((session) => session.problemId === problemId).sort(byEndedAtDescending)
}

export function recentReflections(sessions: readonly SolveSession[], limit: number): SolveSession[] {
  return sessions
    .filter((session) => (session.reflection ?? '').trim() !== '')
    .sort(byEndedAtDescending)
    .slice(0, limit)
}

/** Whole minutes between start and end, or `undefined` when the session was not timed. */
export function sessionMinutes(session: SolveSession): number | undefined {
  const elapsed = Date.parse(session.endedAt) - Date.parse(session.startedAt)

  if (Number.isNaN(elapsed) || elapsed < 30_000) {
    return undefined
  }

  return Math.max(1, Math.round(elapsed / 60_000))
}

/** Counts occurrences, most frequent first, ties in alphabetical order. */
export function rankCounts(values: Iterable<string>): RankedCount[] {
  const counts = new Map<string, number>()

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
}

export function difficultyCounts(problems: readonly SolvedProblem[]): Record<Difficulty, number> {
  const counts: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }

  for (const problem of problems) {
    counts[problem.difficulty] += 1
  }

  return counts
}
