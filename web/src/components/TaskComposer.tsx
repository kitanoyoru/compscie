import { useId, useState, type FormEvent, type JSX } from 'react'

import { parseMinutes } from '../lib/format'
import { useLearningDispatch } from '../state/learning-state'
import { Icon } from './Icon'
import { EMPTY_TASK_FIELDS, TaskFields, type TaskFieldLabels, type TaskFieldsValue } from './TaskFields'

const LABELS: TaskFieldLabels = { title: 'Task title', topic: 'Topic', minutes: 'Minutes' }

export function TaskComposer(): JSX.Element {
  const dispatch = useLearningDispatch()
  const idPrefix = useId()
  const [fields, setFields] = useState<TaskFieldsValue>(EMPTY_TASK_FIELDS)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const trimmedTitle = fields.title.trim()

    if (trimmedTitle === '') {
      return
    }

    dispatch({
      type: 'taskAdded',
      title: trimmedTitle,
      topicId: fields.topicId || undefined,
      estimatedMinutes: parseMinutes(fields.minutes),
    })
    setFields(EMPTY_TASK_FIELDS)
  }

  return (
    <form className="task-composer" onSubmit={handleSubmit} aria-label="Add a task">
      <TaskFields {...fields} onChange={setFields} idPrefix={idPrefix} labels={LABELS} />
      <button type="submit" className="button button-primary">
        <Icon name="plus" />
        Add task
      </button>
    </form>
  )
}
