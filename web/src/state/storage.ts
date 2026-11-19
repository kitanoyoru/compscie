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
    const parsed: unknown = JSON.parse(rawValue)

    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.sessions) ||
      !parsed.tasks.every(isLearningTask) ||
      !parsed.sessions.every(isSolveSession)
    ) {
      return emptyPersonalState()
    }

    return {
      version: 1,
      tasks: parsed.tasks,
      sessions: parsed.sessions,
    }
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
