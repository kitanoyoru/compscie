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

/** One self-graded answer to a note question ("Got it" is success, "Shaky" is needs-review). */
export interface CardReview {
  /** `<note path>::<question slug>`; see domain/quiz.ts. */
  readonly cardId: string
  readonly reviewedAt: string
  readonly outcome: SolveOutcome
}

export interface PersonalLearningState {
  readonly version: 1
  readonly tasks: readonly LearningTask[]
  readonly sessions: readonly SolveSession[]
  /** Added after version 1 shipped: older stored data and backups load with an empty list. */
  readonly cardReviews: readonly CardReview[]
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
      type: 'taskEdited'
      taskId: string
      title: string
      topicId?: string
      estimatedMinutes?: number
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
      type: 'taskReopened'
      taskId: string
    }
  | {
      type: 'taskDeleted'
      taskId: string
    }
  | {
      type: 'taskRestored'
      task: LearningTask
    }
  | {
      type: 'sessionCompleted'
      session: SolveSession
    }
  | {
      type: 'sessionDeleted'
      problemId: number
      endedAt: string
    }
  | {
      type: 'cardReviewed'
      review: CardReview
    }
  | {
      type: 'cardReviewUndone'
      cardId: string
      reviewedAt: string
    }
  | {
      type: 'stateReset'
    }
  | {
      type: 'stateReplaced'
      state: PersonalLearningState
    }
