import { beforeEach, describe, expect, it } from 'vitest'

import type { LearningTask, SolveSession } from '../domain/personal-types'
import { STORAGE_KEY, emptyPersonalState, loadPersonalState, parsePersonalState, savePersonalState } from './storage'

const task: LearningTask = {
  id: 'task-1',
  title: 'Run the date-parts lab',
  topicId: 'clickhouse',
  estimatedMinutes: 30,
  status: 'open',
  createdAt: '2026-11-17T09:00:00.000Z',
}

const session: SolveSession = {
  problemId: 1,
  startedAt: '2026-11-17T09:00:00.000Z',
  endedAt: '2026-11-17T09:20:00.000Z',
  outcome: 'needs-review',
  reflection: 'Review the hash-map invariant.',
}

describe('personal state storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses empty v1 state for malformed local storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    expect(loadPersonalState()).toEqual(emptyPersonalState())
  })

  it('uses empty v1 state for obsolete storage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 0, tasks: [], sessions: [] }))

    expect(loadPersonalState()).toEqual(emptyPersonalState())
  })

  it('round-trips valid tasks and sessions', () => {
    savePersonalState({ version: 1, tasks: [task], sessions: [session] })

    expect(loadPersonalState()).toEqual({ version: 1, tasks: [task], sessions: [session] })
  })
})

describe('parsePersonalState', () => {
  it('accepts a valid state', () => {
    const state = { version: 1, tasks: [task], sessions: [session] }

    expect(parsePersonalState(state)).toEqual(state)
  })

  it.each([
    ['null', null],
    ['an array', []],
    ['a wrong version', { version: 2, tasks: [], sessions: [] }],
    ['missing sessions', { version: 1, tasks: [] }],
    ['a malformed task', { version: 1, tasks: [{}], sessions: [] }],
    ['a malformed session', { version: 1, tasks: [], sessions: [{ problemId: 'x' }] }],
  ])('rejects %s', (_name, value) => {
    expect(parsePersonalState(value)).toBeNull()
  })

  const validTask = { id: 'a', title: 'T', status: 'open', createdAt: '2026-11-17T09:00:00.000Z' }
  const validSession = {
    problemId: 1,
    startedAt: '2026-11-17T09:00:00.000Z',
    endedAt: '2026-11-17T09:20:00.000Z',
    outcome: 'success',
  }

  it('strips unknown properties', () => {
    const parsed = parsePersonalState({
      version: 1,
      tasks: [{ ...validTask, extra: 1 }],
      sessions: [{ ...validSession, extra: 2 }],
    })

    expect(parsed).toEqual({ version: 1, tasks: [validTask], sessions: [validSession] })
  })

  it('drops wrong-typed optional fields but keeps the item', () => {
    const parsed = parsePersonalState({
      version: 1,
      tasks: [{ ...validTask, topicId: 4, estimatedMinutes: -5, completedAt: 'nope' }],
      sessions: [{ ...validSession, reflection: 9 }],
    })

    expect(parsed).toEqual({ version: 1, tasks: [validTask], sessions: [validSession] })
  })

  it.each([
    ['an invalid createdAt', { tasks: [{ ...validTask, createdAt: 'nope' }], sessions: [] }],
    ['an empty id', { tasks: [{ ...validTask, id: '' }], sessions: [] }],
    ['a blank title', { tasks: [{ ...validTask, title: '  ' }], sessions: [] }],
    ['a non-integer problemId', { tasks: [], sessions: [{ ...validSession, problemId: 1.5 }] }],
    ['an invalid endedAt', { tasks: [], sessions: [{ ...validSession, endedAt: 'x' }] }],
  ])('rejects %s', (_name, rest) => {
    expect(parsePersonalState({ version: 1, ...rest })).toBeNull()
  })

  it('keeps a session that ends before it starts', () => {
    const session = { ...validSession, endedAt: '2026-11-17T08:00:00.000Z' }

    expect(parsePersonalState({ version: 1, tasks: [], sessions: [session] })?.sessions).toEqual([session])
  })
})
