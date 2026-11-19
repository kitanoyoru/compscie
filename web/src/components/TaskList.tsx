import type { JSX } from 'react'

import type { LearningTask } from '../domain/personal-types'
import { useLearningDispatch } from '../state/learning-state'

interface TaskListProps {
  readonly tasks: readonly LearningTask[]
  readonly recommendedTaskId?: string
}

export function TaskList({ tasks, recommendedTaskId }: TaskListProps): JSX.Element {
  const dispatch = useLearningDispatch()

  function resetWorkingState(): void {
    const confirmed = window.confirm(
      'Reset all tasks and practice sessions stored in this browser?',
    )

    if (confirmed) {
      dispatch({ type: 'stateReset' })
    }
  }

  return (
    <section className="task-section" aria-labelledby="task-list-heading">
      <div className="section-heading">
        <h2 id="task-list-heading">Task queue</h2>
        <button type="button" className="secondary-button" onClick={resetWorkingState}>
          Reset working state
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add one small learning action above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.id === recommendedTaskId ? 'task-item recommended' : 'task-item'}
            >
              <div className="task-content">
                <p className="task-title">{task.title}</p>
                <p>
                  {task.status === 'completed'
                    ? 'Completed'
                    : task.status === 'deferred'
                      ? 'Deferred'
                      : 'Open'}
                  {task.estimatedMinutes !== undefined ? ` · ${task.estimatedMinutes} min` : ''}
                </p>
              </div>
              <div className="task-actions">
                {task.status !== 'completed' && (
                  <>
                    <button
                      type="button"
                      aria-label={`Complete ${task.title}`}
                      onClick={() => dispatch({ type: 'taskCompleted', taskId: task.id })}
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      aria-label={`Defer ${task.title}`}
                      onClick={() => dispatch({ type: 'taskDeferred', taskId: task.id })}
                    >
                      Defer
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
