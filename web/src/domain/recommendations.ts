import type { Difficulty, RepositorySnapshot, SolvedProblem, TopicSummary } from '../data/types'
import { addLocalDays, dayKeyOf, startOfLocalIsoWeek } from '../lib/calendar'
import type { LearningTask, PersonalLearningState, SolveSession } from './personal-types'
import { isDue, schedulesByProblem } from './review-schedule'

export const FILTER_ALL = 'all'

export interface ProblemFilters {
  readonly difficulty?: Difficulty | typeof FILTER_ALL
  readonly language?: string | typeof FILTER_ALL
  readonly tag?: string | typeof FILTER_ALL
  /** Matches a problem number prefix (optionally written as `#42`) or a title substring. */
  readonly query?: string
}

export type TodayRecommendation =
  | {
      readonly kind: 'task'
      readonly taskId: string
      readonly title: string
      readonly topicId?: string
      readonly estimatedMinutes?: number
    }
  | {
      readonly kind: 'topic'
      readonly topicSlug: string
      readonly title: string
      readonly next: string
    }
  | {
      readonly kind: 'none'
    }

function compareTasks(left: LearningTask, right: LearningTask): number {
  const leftTime = Date.parse(left.createdAt)
  const rightTime = Date.parse(right.createdAt)
  const leftTimestamp = Number.isNaN(leftTime) ? Number.NEGATIVE_INFINITY : leftTime
  const rightTimestamp = Number.isNaN(rightTime) ? Number.NEGATIVE_INFINITY : rightTime

  if (leftTimestamp !== rightTimestamp) {
    return leftTimestamp - rightTimestamp
  }

  return left.id.localeCompare(right.id)
}

export function getTodayRecommendation(
  snapshot: RepositorySnapshot,
  state: PersonalLearningState,
): TodayRecommendation {
  const task = [...state.tasks]
    .filter((item) => item.status === 'open' || item.status === 'deferred')
    .sort((left, right) => {
      const statusRank = (taskStatus: LearningTask['status']) => (taskStatus === 'open' ? 0 : 1)
      const statusDifference = statusRank(left.status) - statusRank(right.status)

      return statusDifference !== 0 ? statusDifference : compareTasks(left, right)
    })
    .at(0)

  if (task) {
    return {
      kind: 'task',
      taskId: task.id,
      title: task.title,
      topicId: task.topicId,
      estimatedMinutes: task.estimatedMinutes,
    }
  }

  const topic = snapshot.topics
    .filter((item): item is TopicSummary & { lastNote: string } => item.status === 'active' && item.lastNote !== null)
    .sort((left, right) => {
      const leftTime = Date.parse(left.lastNote)
      const rightTime = Date.parse(right.lastNote)
      const leftTimestamp = Number.isNaN(leftTime) ? Number.NEGATIVE_INFINITY : leftTime
      const rightTimestamp = Number.isNaN(rightTime) ? Number.NEGATIVE_INFINITY : rightTime

      if (leftTimestamp !== rightTimestamp) {
        return leftTimestamp - rightTimestamp
      }

      return left.slug.localeCompare(right.slug)
    })
    .at(0)

  return topic
    ? { kind: 'topic', topicSlug: topic.slug, title: topic.title, next: topic.next }
    : { kind: 'none' }
}

function matchesQuery(problem: SolvedProblem, query: string): boolean {
  if (query === '') {
    return true
  }

  const numeric = /^#?(\d+)$/.exec(query)

  if (numeric?.[1] !== undefined && String(problem.id).startsWith(numeric[1])) {
    return true
  }

  return problem.title.toLowerCase().includes(query)
}

export function filterProblems(problems: readonly SolvedProblem[], filters: ProblemFilters): SolvedProblem[] {
  const { difficulty, language, tag } = filters
  const query = filters.query?.trim().toLowerCase() ?? ''

  return problems.filter((problem) => {
    const difficultyMatches = difficulty === undefined || difficulty === FILTER_ALL || problem.difficulty === difficulty
    const languageMatches =
      language === undefined || language === FILTER_ALL || problem.languages.includes(language)
    const tagMatches = tag === undefined || tag === FILTER_ALL || problem.tags.includes(tag)

    return difficultyMatches && languageMatches && tagMatches && matchesQuery(problem, query)
  })
}

/**
 * What to practice next among `problems` (already filtered by the page):
 * 1. problems due for review, most overdue first;
 * 2. problems never practiced in this workspace, by number;
 * 3. scheduled problems that are not due yet, soonest first.
 * Ties break by problem number.
 */
export function choosePracticeProblem(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
  now: Date,
): SolvedProblem | undefined {
  const schedules = schedulesByProblem(sessions)
  const today = dayKeyOf(now)

  return [...problems]
    .map((problem) => {
      const schedule = schedules.get(problem.id)
      const rank = schedule === undefined ? 1 : isDue(schedule, today) ? 0 : 2

      return { problem, rank, dueDay: schedule?.dueDay ?? '' }
    })
    .sort(
      (left, right) =>
        left.rank - right.rank || left.dueDay.localeCompare(right.dueDay) || left.problem.id - right.problem.id,
    )
    .at(0)?.problem
}

export function getIsoWeekStart(now: Date): Date {
  return startOfLocalIsoWeek(now)
}

export function countCompletedThisIsoWeek(tasks: readonly LearningTask[], now: Date): number {
  const weekStart = getIsoWeekStart(now)
  const weekEnd = addLocalDays(weekStart, 7)

  return tasks.filter((task) => {
    if (task.status !== 'completed' || task.completedAt === undefined) {
      return false
    }

    const completedTime = Date.parse(task.completedAt)

    return (
      !Number.isNaN(completedTime) &&
      completedTime >= weekStart.getTime() &&
      completedTime < weekEnd.getTime()
    )
  }).length
}
