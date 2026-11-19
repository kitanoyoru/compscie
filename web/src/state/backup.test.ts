import { describe, expect, it } from 'vitest'

import { seededState } from '../test/fixtures'
import { BACKUP_APP_ID, backupFilename, createBackup, readBackup } from './backup'

describe('backup', () => {
  it('round-trips a backup', () => {
    const state = seededState()

    expect(readBackup(createBackup(state, new Date('2026-11-19T18:00:00Z')))).toEqual({ ok: true, state })
  })

  it('writes pretty JSON with the app id, version and export time', () => {
    const text = createBackup(seededState(), new Date('2026-11-19T18:00:00Z'))

    expect(text).toContain('\n  "app"')
    expect(JSON.parse(text)).toMatchObject({
      app: BACKUP_APP_ID,
      version: 1,
      exportedAt: '2026-11-19T18:00:00.000Z',
    })
  })

  it.each([
    ['{', 'This file is not valid JSON.'],
    ['null', 'This file is not a Compscie learning backup.'],
    [
      JSON.stringify({ app: 'other', version: 1, state: seededState() }),
      'This file is not a Compscie learning backup.',
    ],
    [JSON.stringify({ version: 1, state: seededState() }), 'This file is not a Compscie learning backup.'],
    [
      JSON.stringify({ app: BACKUP_APP_ID, version: 2, state: seededState() }),
      'This file is not a Compscie learning backup.',
    ],
    [
      JSON.stringify({ app: BACKUP_APP_ID, version: 1, state: { version: 1, tasks: [{}], sessions: [] } }),
      'This backup’s tasks or sessions are malformed.',
    ],
    [JSON.stringify({ app: BACKUP_APP_ID, version: 1 }), 'This backup’s tasks or sessions are malformed.'],
  ])('rejects %s', (text, error) => {
    expect(readBackup(text)).toEqual({ ok: false, error })
  })

  it('rejects duplicate task ids and oversized collections', () => {
    const state = seededState()
    const [first] = state.tasks
    const malformed = { ok: false, error: 'This backup’s tasks or sessions are malformed.' }

    expect(
      readBackup(JSON.stringify({ app: BACKUP_APP_ID, version: 1, state: { ...state, tasks: [first, first] } })),
    ).toEqual(malformed)

    const sessions = Array.from({ length: 10_001 }, () => state.sessions[0])
    expect(readBackup(JSON.stringify({ app: BACKUP_APP_ID, version: 1, state: { ...state, sessions } }))).toEqual(
      malformed,
    )
  })

  it('strips unknown keys, including __proto__, from imported items', () => {
    const text = `{"app":"${BACKUP_APP_ID}","version":1,"state":{"version":1,"sessions":[],"tasks":[{"id":"a","title":"T","status":"open","createdAt":"2026-11-17T09:00:00.000Z","extra":1,"__proto__":{"polluted":true}}]}}`
    const result = readBackup(text)

    expect(result).toEqual({
      ok: true,
      state: {
        version: 1,
        sessions: [],
        tasks: [{ id: 'a', title: 'T', status: 'open', createdAt: '2026-11-17T09:00:00.000Z' }],
      },
    })
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    if (result.ok) {
      expect(Object.keys(result.state.tasks[0] ?? {})).not.toContain('extra')
      expect(Object.getPrototypeOf(result.state.tasks[0])).toBe(Object.prototype)
    }
  })

  it('names the file after the local day', () => {
    expect(backupFilename(new Date('2026-11-20T05:00:00Z'))).toBe('compscie-learning-2026-11-19.json')
  })
})
