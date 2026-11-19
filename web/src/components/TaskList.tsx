import { useEffect, useId, useRef, useState, type FormEvent, type JSX, type KeyboardEvent } from 'react'

import { topicTitle } from '../data/topics'
import type { LearningTask } from '../domain/personal-types'
import { formatRelativeDay, parseMinutes } from '../lib/format'
import { useLearningDispatch } from '../state/learning-state'
import { Icon } from './Icon'
import { useToast } from './Toast'
import { TaskComposer } from './TaskComposer'
import { EMPTY_TASK_FIELDS, TaskFields, type TaskFieldLabels, type TaskFieldsValue } from './TaskFields'
import { EmptyState } from './ui'

function byCreatedAt(left: LearningTask, right: LearningTask): number {
  return left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id)
}

function byCompletedAtDescending(left: LearningTask, right: LearningTask): number {
  return (right.completedAt ?? '').localeCompare(left.completedAt ?? '')
}

interface TaskItemProps {
  readonly task: LearningTask
  readonly recommended: boolean
}

const EDIT_LABELS: TaskFieldLabels = {
  title: 'Edit task title',
  topic: 'Edit topic',
  minutes: 'Edit minutes',
}

function TaskItem({ task, recommended }: TaskItemProps): JSX.Element {
  const dispatch = useLearningDispatch()
  const showToast = useToast()
  const topic = topicTitle(task.topicId)
  const completed = task.status === 'completed'
  const idPrefix = useId()
  const [editing, setEditing] = useState(false)
  const [fields, setFields] = useState<TaskFieldsValue>(EMPTY_TASK_FIELDS)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)

  useEffect(() => {
    if (editing) {
      titleInputRef.current?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      editButtonRef.current?.focus()
    }
  }, [editing])

  function startEditing(): void {
    setFields({
      title: task.title,
      topicId: task.topicId ?? '',
      minutes: task.estimatedMinutes === undefined ? '' : String(task.estimatedMinutes),
    })
    setEditing(true)
  }

  function stopEditing(): void {
    restoreFocus.current = true
    setEditing(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (fields.title.trim() === '') {
      return
    }

    dispatch({
      type: 'taskEdited',
      taskId: task.id,
      title: fields.title,
      topicId: fields.topicId || undefined,
      estimatedMinutes: parseMinutes(fields.minutes),
    })
    stopEditing()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>): void {
    if (event.key === 'Escape') {
      if (event.nativeEvent.isComposing) {
        return
      }


      event.preventDefault()
      event.stopPropagation()
      stopEditing()
    }
  }

  return (
    <li className="task-item" data-status={task.status} data-recommended={recommended ? 'true' : undefined}>
      {!editing && (
        <button
          type="button"
          className="task-check"
          aria-label={completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
          title={completed ? 'Reopen' : 'Complete'}
          onClick={() => {
            if (completed) {
              dispatch({ type: 'taskReopened', taskId: task.id })
              return
            }

            dispatch({ type: 'taskCompleted', taskId: task.id })
            showToast({
              message: `Completed “${task.title}”`,
              action: { label: 'Undo', onAction: () => dispatch({ type: 'taskRestored', task }) },
            })
          }}
        >
          <Icon name="check" size={14} />
        </button>
      )}
      {editing ? (
        <form
          className="task-edit-form"
          aria-label={`Edit ${task.title}`}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          <TaskFields
            {...fields}
            onChange={setFields}
            idPrefix={idPrefix}
            labels={EDIT_LABELS}
            titleInputRef={titleInputRef}
          />
          <div className="task-edit-actions">
            <button type="submit" className="button button-primary">
              Save
            </button>
            <button type="button" className="button" onClick={stopEditing}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-body">
            <p className="task-title">{task.title}</p>
            <p className="task-meta">
              {recommended && <span className="tag tag-accent">Up next</span>}
              {topic !== undefined && <span className="tag">{topic}</span>}
              {task.estimatedMinutes !== undefined && (
                <span className="meta-item">
                  <Icon name="clock" size={13} />
                  {task.estimatedMinutes} min
                </span>
              )}
              <span className="meta-item">
                {completed && task.completedAt !== undefined
                  ? `Done ${formatRelativeDay(task.completedAt)}`
                  : `Added ${formatRelativeDay(task.createdAt)}`}
              </span>
            </p>
          </div>
          <div className="task-actions">
            {!completed && (
              <button
                ref={editButtonRef}
                type="button"
                className="icon-button"
                aria-label={`Edit ${task.title}`}
                title="Edit"
                onClick={startEditing}
              >
                <Icon name="pencil" />
              </button>
            )}
            {task.status === 'open' && (
              <button
                type="button"
                className="icon-button"
                aria-label={`Defer ${task.title}`}
                title="Defer"
                onClick={() => dispatch({ type: 'taskDeferred', taskId: task.id })}
              >
                <Icon name="skip" />
              </button>
            )}
            {task.status === 'deferred' && (
              <button
                type="button"
                className="icon-button"
                aria-label={`Resume ${task.title}`}
                title="Move back to open"
                onClick={() => dispatch({ type: 'taskReopened', taskId: task.id })}
              >
                <Icon name="rotate" />
              </button>
            )}
            <button
              type="button"
              className="icon-button icon-button-danger"
              aria-label={`Delete ${task.title}`}
              title="Delete"
              onClick={() => {
                dispatch({ type: 'taskDeleted', taskId: task.id })
                document.getElementById('task-list-heading')?.focus()
                showToast({
                  message: `Deleted “${task.title}”`,
                  action: { label: 'Undo', onAction: () => dispatch({ type: 'taskRestored', task }) },
                })
              }}
            >
              <Icon name="trash" />
            </button>
          </div>
        </>
      )}
    </li>
  )
}

interface TaskGroupProps {
  readonly title: string
  readonly tasks: readonly LearningTask[]
  readonly recommendedTaskId?: string
}

function TaskGroup({ title, tasks, recommendedTaskId }: TaskGroupProps): JSX.Element {
  const headingId = useId()

  return (
    <div className="task-group">
      <h3 className="task-group-title" id={headingId}>
        {title}
        <span className="count">{tasks.length}</span>
      </h3>
      <ul className="task-list" aria-label={`${title} tasks`}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} recommended={task.id === recommendedTaskId} />
        ))}
      </ul>
    </div>
  )
}

interface TaskListProps {
  readonly tasks: readonly LearningTask[]
  readonly recommendedTaskId?: string
}

export function TaskList({ tasks, recommendedTaskId }: TaskListProps): JSX.Element {
  const open = tasks.filter((task) => task.status === 'open').sort(byCreatedAt)
  const deferred = tasks.filter((task) => task.status === 'deferred').sort(byCreatedAt)
  const completed = tasks.filter((task) => task.status === 'completed').sort(byCompletedAtDescending)

  return (
    <section className="card" aria-labelledby="task-list-heading">
      <div className="card-header">
        <div>
          <h2 id="task-list-heading" tabIndex={-1}>Task queue</h2>
          <p className="card-subtitle">
            {open.length} open · {deferred.length} deferred · {completed.length} done
          </p>
        </div>
      </div>

      <TaskComposer />

      {tasks.length === 0 ? (
        <EmptyState title="Your queue is empty">
          Add one small, concrete action: a note to write, a lab to run, or a problem to revisit.
        </EmptyState>
      ) : (
        <div className="task-groups">
          {open.length > 0 && (
            <TaskGroup title="Open" tasks={open} recommendedTaskId={recommendedTaskId} />
          )}
          {deferred.length > 0 && (
            <TaskGroup title="Deferred" tasks={deferred} recommendedTaskId={recommendedTaskId} />
          )}
          {completed.length > 0 && (
            <details className="task-group task-group-completed">
              <summary className="task-group-title">
                <Icon name="chevronDown" size={14} className="details-chevron" />
                Completed
                <span className="count">{completed.length}</span>
              </summary>
              <ul className="task-list" aria-label="Completed tasks">
                {completed.map((task) => (
                  <TaskItem key={task.id} task={task} recommended={false} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  )
}
