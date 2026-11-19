import { beforeEach, describe, expect, it } from 'vitest'

import { clearSessionDraft, loadSessionDraft, saveSessionDraft, SESSION_DRAFT_KEY, type SessionDraft } from './session-draft'

const first: SessionDraft = { problemId: 1, startedAt: 1_700_000_000_000, outcome: 'success', reflection: 'Hash map' }
const second: SessionDraft = { problemId: 2, startedAt: null, outcome: 'needs-review', reflection: 'Carry' }

describe('session drafts', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('round-trips a draft', () => {
    saveSessionDraft(first)

    expect(loadSessionDraft(1)).toEqual(first)
    expect(loadSessionDraft(2)).toBeUndefined()
  })

  it('reads a malformed store as empty', () => {
    sessionStorage.setItem(SESSION_DRAFT_KEY, '{not json')
    expect(loadSessionDraft(1)).toBeUndefined()

    sessionStorage.setItem(SESSION_DRAFT_KEY, '[1,2]')
    expect(loadSessionDraft(1)).toBeUndefined()

    saveSessionDraft(first)
    expect(loadSessionDraft(1)).toEqual(first)
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

    expect(loadSessionDraft(1)).toBeUndefined()
    expect(loadSessionDraft(3)).toBeUndefined()
    expect(loadSessionDraft(4)).toBeUndefined()
    expect(loadSessionDraft(2)).toEqual(second)

    saveSessionDraft(first)
    expect(loadSessionDraft(2)).toEqual(second)
    expect(loadSessionDraft(1)).toEqual(first)
  })

  it('clears one problem without touching the others', () => {
    saveSessionDraft(first)
    saveSessionDraft(second)

    clearSessionDraft(1)

    expect(loadSessionDraft(1)).toBeUndefined()
    expect(loadSessionDraft(2)).toEqual(second)
  })
})
