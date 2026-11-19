import type { Difficulty, RepositorySnapshot, SolvedProblem, TopicSummary } from '../data/types'
import type { LearningTask, PersonalLearningState, SolveSession } from './personal-types'

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

function latestSession(sessions: readonly SolveSession[]): SolveSession | undefined {
  return sessions.reduce<SolveSession | undefined>((latest, session) => {
    if (!latest || Date.parse(session.endedAt) > Date.parse(latest.endedAt)) {
      return session
    }

    return latest
  }, undefined)
}

export function choosePracticeProblem(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
): SolvedProblem | undefined {
  const sessionsByProblem = new Map<number, SolveSession[]>()

  for (const session of sessions) {
    const problemSessions = sessionsByProblem.get(session.problemId) ?? []
    problemSessions.push(session)
    sessionsByProblem.set(session.problemId, problemSessions)
  }

  return [...problems]
    .map((problem) => {
      const problemSessions = sessionsByProblem.get(problem.id) ?? []
      const latest = latestSession(problemSessions)

      return {
        problem,
        category: latest === undefined ? 1 : latest.outcome === 'needs-review' ? 0 : 2,
        timestamp: latest?.endedAt,
      }
    })
    .sort((left, right) => {
      if (left.category !== right.category) {
        return left.category - right.category
      }

      if (left.category === 0) {
        const leftTime = left.timestamp === undefined ? Number.NEGATIVE_INFINITY : Date.parse(left.timestamp)
        const rightTime = right.timestamp === undefined ? Number.NEGATIVE_INFINITY : Date.parse(right.timestamp)
        const timeDifference = rightTime - leftTime

        return timeDifference !== 0 ? timeDifference : left.problem.id - right.problem.id
      }

      if (left.category === 2) {
        const leftTime = left.timestamp === undefined ? Number.POSITIVE_INFINITY : Date.parse(left.timestamp)
        const rightTime = right.timestamp === undefined ? Number.POSITIVE_INFINITY : Date.parse(right.timestamp)
        const timeDifference = leftTime - rightTime

        return timeDifference !== 0 ? timeDifference : left.problem.id - right.problem.id
      }

      return left.problem.id - right.problem.id
    })
    .at(0)?.problem
}

export function getIsoWeekStart(now: Date): Date {
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const daysSinceMonday = (now.getUTCDay() + 6) % 7

  return new Date(utcMidnight - daysSinceMonday * 24 * 60 * 60 * 1000)
}

export function countCompletedThisIsoWeek(tasks: readonly LearningTask[], now: Date): number {
  const weekStart = getIsoWeekStart(now)
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

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
