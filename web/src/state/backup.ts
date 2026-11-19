import type { PersonalLearningState } from '../domain/personal-types'
import { localDayKey } from '../lib/calendar'
import { parsePersonalState } from './storage'

export const BACKUP_APP_ID = 'compscie-learning-platform'

export type BackupReadResult =
  | { readonly ok: true; readonly state: PersonalLearningState }
  | { readonly ok: false; readonly error: string }

export function createBackup(state: PersonalLearningState, now: Date): string {
  return JSON.stringify({ app: BACKUP_APP_ID, version: 1, exportedAt: now.toISOString(), state }, null, 2)
}

export function backupFilename(now: Date): string {
  return `compscie-learning-${localDayKey(now) ?? 'backup'}.json`
}

export function readBackup(text: string): BackupReadResult {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' }
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('app' in parsed) ||
    parsed.app !== BACKUP_APP_ID ||
    !('version' in parsed) ||
    parsed.version !== 1
  ) {
    return { ok: false, error: 'This file is not a Compscie learning backup.' }
  }

  const state = parsePersonalState('state' in parsed ? parsed.state : undefined)

  return state === null
    ? { ok: false, error: 'This backup’s tasks or sessions are malformed.' }
    : { ok: true, state }
}
