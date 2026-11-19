import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import type { LearningAction } from '../domain/personal-types'
import { LearningProvider, useLearningDispatch, useLearningState } from './learning-state'
import { STORAGE_KEY, emptyPersonalState, loadPersonalState } from './storage'

function useProbe() {
  return { state: useLearningState(), dispatch: useLearningDispatch() }
}

function dispatch(action: LearningAction) {
  const { result } = renderHook(useProbe, { wrapper: LearningProvider })

  act(() => {
    result.current.dispatch(action)
  })

  return result.current.state
}

describe('learning state', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a task as open', () => {
    const state = dispatch({
      type: 'taskAdded',
      id: 'task-1',
      title: 'Run the date-parts lab',
      topicId: 'clickhouse',
      estimatedMinutes: 30,
      createdAt: '2026-11-17T09:00:00.000Z',
    })

    expect(state.tasks).toHaveLength(1)
    expect(state.tasks[0]).toMatchObject({
      id: 'task-1',
      title: 'Run the date-parts lab',
      status: 'open',
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 1,
      tasks: [{ id: 'task-1' }],
    })
  })

  it('completes and defers tasks', () => {
    const added = dispatch({
      type: 'taskAdded',
      id: 'task-1',
      title: 'Run the date-parts lab',
      createdAt: '2026-11-17T09:00:00.000Z',
    })
    const completed = dispatch({
      type: 'taskCompleted',
      taskId: 'task-1',
      completedAt: '2026-11-17T10:00:00.000Z',
    })

    expect(completed.tasks[0]).toMatchObject({ status: 'completed', completedAt: '2026-11-17T10:00:00.000Z' })

    const deferred = dispatch({
      type: 'taskDeferred',
      taskId: added.tasks[0]!.id,
    })

    expect(deferred.tasks[0]).toMatchObject({ status: 'deferred' })
    expect(deferred.tasks[0]?.completedAt).toBeUndefined()
  })

  it('reopens and deletes tasks', () => {
    dispatch({
      type: 'taskAdded',
      id: 'task-1',
      title: 'Run the date-parts lab',
      createdAt: '2026-11-17T09:00:00.000Z',
    })
    dispatch({ type: 'taskCompleted', taskId: 'task-1', completedAt: '2026-11-17T10:00:00.000Z' })

    const reopened = dispatch({ type: 'taskReopened', taskId: 'task-1' })

    expect(reopened.tasks[0]).toMatchObject({ status: 'open' })
    expect(reopened.tasks[0]?.completedAt).toBeUndefined()

    const deleted = dispatch({ type: 'taskDeleted', taskId: 'task-1' })

    expect(deleted.tasks).toEqual([])
    expect(loadPersonalState().tasks).toEqual([])
  })

  it('records a completed solving session', () => {
    const state = dispatch({
      type: 'sessionCompleted',
      session: {
        problemId: 1,
        startedAt: '2026-11-17T09:00:00.000Z',
        endedAt: '2026-11-17T09:20:00.000Z',
        outcome: 'success',
        reflection: 'Two-pointer invariant was clear.',
      },
    })

    expect(state.sessions).toHaveLength(1)
    expect(state.sessions[0]).toMatchObject({ problemId: 1, outcome: 'success' })
    expect(loadPersonalState()).toEqual(state)
  })

  it('resets to empty v1 state', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        tasks: [
          {
            id: 'task-1',
            title: 'Old task',
            status: 'completed',
            createdAt: '2026-11-01T09:00:00.000Z',
            completedAt: '2026-11-02T09:00:00.000Z',
          },
        ],
        sessions: [],
      }),
    )

    const state = dispatch({ type: 'stateReset' })

    expect(state).toEqual(emptyPersonalState())
    expect(loadPersonalState()).toEqual(emptyPersonalState())
  })
})
