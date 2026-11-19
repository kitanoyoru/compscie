import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type JSX,
  type PropsWithChildren,
} from 'react'

import type { LearningAction, LearningTask, PersonalLearningState } from '../domain/personal-types'
import { emptyPersonalState, loadPersonalState, savePersonalState } from './storage'

function createTaskId(): string {
  return crypto.randomUUID()
}

export function learningReducer(state: PersonalLearningState, action: LearningAction): PersonalLearningState {
  switch (action.type) {
    case 'taskAdded': {
      const task: LearningTask = {
        id: action.id ?? createTaskId(),
        title: action.title,
        topicId: action.topicId,
        estimatedMinutes: action.estimatedMinutes,
        status: 'open',
        createdAt: action.createdAt ?? new Date().toISOString(),
      }

      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'taskCompleted': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId
            ? {
                ...task,
                status: 'completed',
                completedAt: action.completedAt ?? new Date().toISOString(),
              }
            : task,
        ),
      }
    }
    case 'taskDeferred': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId
            ? { ...task, status: 'deferred', completedAt: undefined }
            : task,
        ),
      }
    }
    case 'taskReopened': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, status: 'open', completedAt: undefined } : task,
        ),
      }
    }
    case 'taskDeleted': {
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.taskId) }
    }
    case 'taskRestored': {
      return state.tasks.some((task) => task.id === action.task.id)
        ? { ...state, tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)) }
        : { ...state, tasks: [...state.tasks, action.task] }
    }
    case 'sessionCompleted': {
      return { ...state, sessions: [...state.sessions, action.session] }
    }
    case 'sessionDeleted': {
      const index = state.sessions.findIndex(
        (session) => session.problemId === action.problemId && session.endedAt === action.endedAt,
      )

      return index === -1
        ? state
        : { ...state, sessions: state.sessions.filter((_, position) => position !== index) }
    }
    case 'stateReset': {
      return emptyPersonalState()
    }
  }
}

const LearningStateContext = createContext<PersonalLearningState | null>(null)
const LearningDispatchContext = createContext<Dispatch<LearningAction> | null>(null)

export function LearningProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, dispatch] = useReducer(learningReducer, undefined, loadPersonalState)

  useEffect(() => {
    savePersonalState(state)
  }, [state])

  return (
    <LearningStateContext.Provider value={state}>
      <LearningDispatchContext.Provider value={dispatch}>{children}</LearningDispatchContext.Provider>
    </LearningStateContext.Provider>
  )
}

export function useLearningState(): PersonalLearningState {
  const state = useContext(LearningStateContext)

  if (state === null) {
    throw new Error('useLearningState must be used within LearningProvider')
  }

  return state
}

export function useLearningDispatch(): Dispatch<LearningAction> {
  const dispatch = useContext(LearningDispatchContext)

  if (dispatch === null) {
    throw new Error('useLearningDispatch must be used within LearningProvider')
  }

  return dispatch
}
