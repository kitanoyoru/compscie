import { isRecord } from '../lib/guards'
import type { CardReview, LearningTask, PersonalLearningState, SolveSession } from '../domain/personal-types'

export const STORAGE_KEY = 'compscie.learning-platform.v1'

export function emptyPersonalState(): PersonalLearningState {
  return { version: 1, tasks: [], sessions: [], cardReviews: [] }
}

const TASK_STATUSES: readonly string[] = ['open', 'deferred', 'completed']
const SESSION_OUTCOMES: readonly string[] = ['success', 'needs-review']

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

/** Rebuilds a task from known fields only. Returns null when a required field is invalid. */
function sanitizeTask(value: unknown): LearningTask | null {
  if (!isRecord(value)) {
    return null
  }

  const { id, title, status, createdAt, topicId, estimatedMinutes, completedAt } = value

  if (
    typeof id !== 'string' ||
    id === '' ||
    typeof title !== 'string' ||
    title.trim() === '' ||
    typeof status !== 'string' ||
    !TASK_STATUSES.includes(status) ||
    !isDateString(createdAt)
  ) {
    return null
  }

  return {
    id,
    title,
    status: status as LearningTask['status'],
    createdAt,
    ...(typeof topicId === 'string' ? { topicId } : {}),
    ...(typeof estimatedMinutes === 'number' && Number.isFinite(estimatedMinutes) && estimatedMinutes > 0
      ? { estimatedMinutes }
      : {}),
    ...(isDateString(completedAt) ? { completedAt } : {}),
  }
}

/** Rebuilds a session from known fields only. Returns null when a required field is invalid. */
function sanitizeSession(value: unknown): SolveSession | null {
  if (!isRecord(value)) {
    return null
  }

  const { problemId, startedAt, endedAt, outcome, reflection } = value

  if (
    typeof problemId !== 'number' ||
    !Number.isInteger(problemId) ||
    problemId <= 0 ||
    !isDateString(startedAt) ||
    !isDateString(endedAt) ||
    typeof outcome !== 'string' ||
    !SESSION_OUTCOMES.includes(outcome)
  ) {
    return null
  }

  return {
    problemId,
    startedAt,
    endedAt,
    outcome: outcome as SolveSession['outcome'],
    ...(typeof reflection === 'string' ? { reflection } : {}),
  }
}

/** Rebuilds a card review from known fields only. Returns null when a field is invalid. */
function sanitizeCardReview(value: unknown): CardReview | null {
  if (!isRecord(value)) {
    return null
  }

  const { cardId, reviewedAt, outcome } = value

  if (
    typeof cardId !== 'string' ||
    cardId === '' ||
    !isDateString(reviewedAt) ||
    typeof outcome !== 'string' ||
    !SESSION_OUTCOMES.includes(outcome)
  ) {
    return null
  }

  return { cardId, reviewedAt, outcome: outcome as CardReview['outcome'] }
}

function sanitizeAll<T>(items: readonly unknown[], sanitize: (item: unknown) => T | null): T[] | null {
  const result: T[] = []

  for (const item of items) {
    const clean = sanitize(item)

    if (clean === null) {
      return null
    }

    result.push(clean)
  }

  return result
}

/**
 * Validates an untrusted value (stored or imported) and rebuilds it from known fields.
 * Unknown keys and wrong-typed optional fields are dropped; invalid required fields reject it.
 * `cardReviews` came later, so it is forgiving: a missing list is empty, and invalid entries are
 * dropped one by one instead of rejecting the state.
 */
export function parsePersonalState(value: unknown): PersonalLearningState | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.tasks) || !Array.isArray(value.sessions)) {
    return null
  }

  const tasks = sanitizeAll(value.tasks, sanitizeTask)
  const sessions = sanitizeAll(value.sessions, sanitizeSession)

  if (tasks === null || sessions === null) {
    return null
  }

  const cardReviews = Array.isArray(value.cardReviews)
    ? value.cardReviews.map(sanitizeCardReview).filter((review): review is CardReview => review !== null)
    : []

  return { version: 1, tasks, sessions, cardReviews }
}

export function loadPersonalState(): PersonalLearningState {
  let rawValue: string | null

  try {
    rawValue = localStorage.getItem(STORAGE_KEY)
  } catch {
    return emptyPersonalState()
  }

  if (rawValue === null) {
    return emptyPersonalState()
  }

  try {
    return parsePersonalState(JSON.parse(rawValue)) ?? emptyPersonalState()
  } catch {
    return emptyPersonalState()
  }
}

export function savePersonalState(state: PersonalLearningState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // The workspace remains usable in this tab even if browser storage is unavailable.
  }
}
