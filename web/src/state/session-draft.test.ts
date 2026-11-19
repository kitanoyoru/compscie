import { beforeEach, describe, expect, it } from 'vitest'

import { clearSessionDraft, loadSessionDraft, saveSessionDraft, SESSION_DRAFT_KEY, type SessionDraft } from './session-draft'

const first: SessionDraft = { problemId: 1, startedAt: 1_700_000_000_000, outcome: 'success', reflection: 'Hash map' }
const at = first.startedAt! + 1000
const second: SessionDraft = { problemId: 2, startedAt: null, outcome: 'needs-review', reflection: 'Carry' }

describe('session drafts', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('round-trips a draft', () => {
    saveSessionDraft(first)

    expect(loadSessionDraft(1, at)).toEqual(first)
    expect(loadSessionDraft(2, at)).toBeUndefined()
  })

  it('reads a malformed store as empty', () => {
    sessionStorage.setItem(SESSION_DRAFT_KEY, '{not json')
    expect(loadSessionDraft(1, at)).toBeUndefined()

    sessionStorage.setItem(SESSION_DRAFT_KEY, '[1,2]')
    expect(loadSessionDraft(1, at)).toBeUndefined()

    saveSessionDraft(first)
    expect(loadSessionDraft(1, at)).toEqual(first)
  })

  it('drops a malformed entry and keeps the others', () => {
    sessionStorage.setItem(
      SESSION_DRAFT_KEY,
      JSON.stringify({
        '1': { ...first, outcome: 'maybe' },
        '2': second,
        '3': { problemId: 3, startedAt: 'now', outcome: 'success', reflection: '' },
        '4': { ...first, problemId: 9 },
      }),
    )

    expect(loadSessionDraft(1, at)).toBeUndefined()
    expect(loadSessionDraft(3, at)).toBeUndefined()
    expect(loadSessionDraft(4, at)).toBeUndefined()
    expect(loadSessionDraft(2, at)).toEqual(second)

    saveSessionDraft(first)
    expect(loadSessionDraft(2, at)).toEqual(second)
    expect(loadSessionDraft(1, at)).toEqual(first)
  })

  it('clears one problem without touching the others', () => {
    saveSessionDraft(first)
    saveSessionDraft(second)

    clearSessionDraft(1)

    expect(loadSessionDraft(1, at)).toBeUndefined()
    expect(loadSessionDraft(2, at)).toEqual(second)
  })

  it('drops a start time more than a minute in the future but keeps the rest', () => {
    saveSessionDraft(first)

    expect(loadSessionDraft(1, first.startedAt! - 61_000)).toEqual({ ...first, startedAt: null })
    expect(loadSessionDraft(1, first.startedAt! - 30_000)).toEqual(first)
  })

  it('drops a start time older than twelve hours but keeps the rest', () => {
    saveSessionDraft(first)
    const hour = 60 * 60 * 1000

    expect(loadSessionDraft(1, first.startedAt! + 12 * hour + 1)).toEqual({ ...first, startedAt: null })
    expect(loadSessionDraft(1, first.startedAt! + 12 * hour)).toEqual(first)
  })
})
