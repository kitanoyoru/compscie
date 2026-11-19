import type { SolveOutcome } from '../domain/personal-types'

export const SESSION_DRAFT_KEY = 'compscie.session-draft.v1'

export interface SessionDraft {
  readonly problemId: number
  /** Epoch milliseconds when the timer started, or null when it is not running. */
  readonly startedAt: number | null
  readonly outcome: SolveOutcome
  readonly reflection: string
}

type DraftStore = Record<string, SessionDraft>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSessionDraft(value: unknown, key: string): value is SessionDraft {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.problemId === 'number' &&
    String(value.problemId) === key &&
    (value.startedAt === null || (typeof value.startedAt === 'number' && Number.isFinite(value.startedAt))) &&
    (value.outcome === 'success' || value.outcome === 'needs-review') &&
    typeof value.reflection === 'string'
  )
}

/** Reads the whole store, keeping only valid entries. Malformed storage reads as empty. */
function readStore(): DraftStore {
  try {
    const rawValue = sessionStorage.getItem(SESSION_DRAFT_KEY)

    if (rawValue === null) {
      return {}
    }

    const parsed: unknown = JSON.parse(rawValue)

    if (!isRecord(parsed)) {
      return {}
    }

    const store: DraftStore = {}

    for (const [key, value] of Object.entries(parsed)) {
      if (isSessionDraft(value, key)) {
        store[key] = {
          problemId: value.problemId,
          startedAt: value.startedAt,
          outcome: value.outcome,
          reflection: value.reflection,
        }
      }
    }

    return store
  } catch {
    return {}
  }
}

function writeStore(store: DraftStore): void {
  try {
    if (Object.keys(store).length === 0) {
      sessionStorage.removeItem(SESSION_DRAFT_KEY)
    } else {
      sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(store))
    }
  } catch {
    // Drafts are a convenience; the recorder keeps working without browser storage.
  }
}

export function loadSessionDraft(problemId: number): SessionDraft | undefined {
  return readStore()[String(problemId)]
}

export function saveSessionDraft(draft: SessionDraft): void {
  writeStore({ ...readStore(), [String(draft.problemId)]: draft })
}

export function clearSessionDraft(problemId: number): void {
  const store = readStore()

  if (!(String(problemId) in store)) {
    return
  }

  delete store[String(problemId)]
  writeStore(store)
}
