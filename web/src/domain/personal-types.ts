export type TaskStatus = 'open' | 'deferred' | 'completed'
export type SolveOutcome = 'success' | 'needs-review'

export interface LearningTask {
  readonly id: string
  readonly title: string
  readonly topicId?: string
  readonly estimatedMinutes?: number
  readonly status: TaskStatus
  readonly createdAt: string
  readonly completedAt?: string
}

export interface SolveSession {
  readonly problemId: number
  readonly startedAt: string
  readonly endedAt: string
  readonly outcome: SolveOutcome
  readonly reflection?: string
}

export interface PersonalLearningState {
  readonly version: 1
  readonly tasks: readonly LearningTask[]
  readonly sessions: readonly SolveSession[]
}

export type LearningAction =
  | {
      type: 'taskAdded'
      title: string
      topicId?: string
      estimatedMinutes?: number
      id?: string
      createdAt?: string
    }
  | {
      type: 'taskCompleted'
      taskId: string
      completedAt?: string
    }
  | {
      type: 'taskDeferred'
      taskId: string
    }
  | {
      type: 'sessionCompleted'
      session: SolveSession
    }
  | {
      type: 'stateReset'
    }
