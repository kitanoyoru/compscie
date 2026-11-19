import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import type { LearningAction, LearningTask, SolveSession } from '../domain/personal-types'
import { LearningProvider, learningReducer, useLearningDispatch, useLearningState } from './learning-state'
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
      cardReviews: [],
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
        cardReviews: [],
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

  describe('taskEdited', () => {
    const base: LearningTask = {
      id: 'a',
      title: 'Old',
      topicId: 'go',
      estimatedMinutes: 30,
      status: 'deferred',
      createdAt: '2026-11-17T09:00:00.000Z',
    }
    const state = { version: 1, cardReviews: [], tasks: [base], sessions: [] } as const

    it('returns the same state for a whitespace-only title', () => {
      expect(learningReducer(state, { type: 'taskEdited', taskId: 'a', title: '   ' })).toBe(state)
    })

    it('clears omitted fields and keeps status and dates', () => {
      const completed: LearningTask = { ...base, status: 'completed', completedAt: '2026-11-19T10:00:00.000Z' }
      const next = learningReducer(
        { ...state, tasks: [completed] },
        { type: 'taskEdited', taskId: 'a', title: '  New title ' },
      )

      expect(next.tasks[0]).toEqual({
        id: 'a',
        title: 'New title',
        topicId: undefined,
        estimatedMinutes: undefined,
        status: 'completed',
        createdAt: '2026-11-17T09:00:00.000Z',
        completedAt: '2026-11-19T10:00:00.000Z',
      })
    })

    it('sets topic and minutes', () => {
      const next = learningReducer(state, {
        type: 'taskEdited',
        taskId: 'a',
        title: 'Old',
        topicId: 'clickhouse',
        estimatedMinutes: 15,
      })

      expect(next.tasks[0]).toMatchObject({ topicId: 'clickhouse', estimatedMinutes: 15, status: 'deferred' })
    })
  })

  describe('undo actions', () => {
    function task(id: string): LearningTask {
      return { id, title: `Task ${id}`, status: 'open', createdAt: '2026-11-17T09:00:00.000Z' }
    }

    function session(problemId: number, endedAt: string): SolveSession {
      return { problemId, startedAt: '2026-11-17T09:00:00.000Z', endedAt, outcome: 'success' }
    }

    it('restores the exact previous version of a task in place', () => {
      const deferred: LearningTask = { ...task('a'), status: 'deferred' }
      const state = { version: 1, cardReviews: [], tasks: [deferred, task('b')], sessions: [] } as const
      const completed = learningReducer(state, {
        type: 'taskCompleted',
        taskId: 'a',
        completedAt: '2026-11-19T10:00:00.000Z',
      })

      expect(learningReducer(completed, { type: 'taskRestored', task: deferred }).tasks).toEqual([
        deferred,
        task('b'),
      ])
    })

    it('appends a restored task when it is absent', () => {
      const state = { version: 1, cardReviews: [], tasks: [task('b')], sessions: [] } as const

      expect(learningReducer(state, { type: 'taskRestored', task: task('a') }).tasks).toEqual([
        task('b'),
        task('a'),
      ])
    })

    it('deletes only the first session matching problem and end time', () => {
      const state = {
        version: 1,
        cardReviews: [],
        tasks: [],
        sessions: [session(1, 'A'), session(1, 'B'), session(1, 'A')],
      } as const

      expect(
        learningReducer(state, { type: 'sessionDeleted', problemId: 1, endedAt: 'A' }).sessions,
      ).toEqual([session(1, 'B'), session(1, 'A')])
    })
  })

  describe('stateReplaced', () => {
    it('replaces the whole state', () => {
      const next = {
        version: 1,
        cardReviews: [],
        tasks: [{ id: 'z', title: 'Z', status: 'open', createdAt: '2026-11-17T09:00:00.000Z' }],
        sessions: [{ problemId: 7, startedAt: 'S', endedAt: 'E', outcome: 'success' }],
      } as const

      expect(learningReducer(emptyPersonalState(), { type: 'stateReplaced', state: next })).toEqual(next)
    })
  })
})

describe('card reviews', () => {
  const review = { cardId: 'notes/go/channels.md::why', reviewedAt: '2026-11-19T18:00:00.000Z', outcome: 'success' } as const

  it('records a review and undoes exactly that review', () => {
    const later = { ...review, reviewedAt: '2026-11-20T18:00:00.000Z' }
    const once = learningReducer(emptyPersonalState(), { type: 'cardReviewed', review })
    const twice = learningReducer(once, { type: 'cardReviewed', review: later })

    expect(twice.cardReviews).toEqual([review, later])
    expect(
      learningReducer(twice, { type: 'cardReviewUndone', cardId: review.cardId, reviewedAt: later.reviewedAt })
        .cardReviews,
    ).toEqual([review])
    expect(learningReducer(twice, { type: 'cardReviewUndone', cardId: 'other', reviewedAt: review.reviewedAt })).toBe(twice)
  })

  it('clears reviews on reset', () => {
    const reviewed = learningReducer(emptyPersonalState(), { type: 'cardReviewed', review })

    expect(learningReducer(reviewed, { type: 'stateReset' }).cardReviews).toEqual([])
  })
})
