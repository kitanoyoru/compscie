import type { LearningTask, PersonalLearningState, SolveSession } from '../domain/personal-types'

export const STORAGE_KEY = 'compscie.learning-platform.v1'

export function emptyPersonalState(): PersonalLearningState {
  return { version: 1, tasks: [], sessions: [] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLearningTask(value: unknown): value is LearningTask {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.createdAt === 'string' &&
    (value.status === 'open' || value.status === 'deferred' || value.status === 'completed')
  )
}

function isSolveSession(value: unknown): value is SolveSession {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.problemId === 'number' &&
    typeof value.startedAt === 'string' &&
    typeof value.endedAt === 'string' &&
    (value.outcome === 'success' || value.outcome === 'needs-review')
  )
}

/** Validates an untrusted value (stored or imported) as personal learning state. */
export function parsePersonalState(value: unknown): PersonalLearningState | null {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.tasks) ||
    !Array.isArray(value.sessions) ||
    !value.tasks.every(isLearningTask) ||
    !value.sessions.every(isSolveSession)
  ) {
    return null
  }

  return { version: 1, tasks: value.tasks, sessions: value.sessions }
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
