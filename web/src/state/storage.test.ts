import { beforeEach, describe, expect, it } from 'vitest'

import type { LearningTask, SolveSession } from '../domain/personal-types'
import { STORAGE_KEY, emptyPersonalState, loadPersonalState, savePersonalState } from './storage'

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
