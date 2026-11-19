import { useId, useState, type FormEvent, type JSX } from 'react'

import { repositorySnapshot } from '../data/generated/repository'
import { useLearningDispatch } from '../state/learning-state'
import { Icon } from './Icon'

export function TaskComposer(): JSX.Element {
  const dispatch = useLearningDispatch()
  const titleInputId = useId()
  const topicInputId = useId()
  const minutesInputId = useId()
  const [title, setTitle] = useState('')
  const [topicId, setTopicId] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const minutes = Number(estimatedMinutes)

    if (trimmedTitle === '') {
      return
    }

    dispatch({
      type: 'taskAdded',
      title: trimmedTitle,
      topicId: topicId || undefined,
      estimatedMinutes:
        estimatedMinutes.trim() !== '' && Number.isFinite(minutes) && minutes > 0
          ? minutes
          : undefined,
    })
    setTitle('')
    setTopicId('')
    setEstimatedMinutes('')
  }

  return (
    <form className="task-composer" onSubmit={handleSubmit} aria-label="Add a task">
      <div className="field field-title">
        <label className="field-label" htmlFor={titleInputId}>
          Task title
        </label>
        <input
          id={titleInputId}
          className="input"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={160}
          autoComplete="off"
          placeholder="What will you learn next?"
        />
      </div>
      <div className="field field-topic">
        <label className="field-label" htmlFor={topicInputId}>
          Topic
        </label>
        <select
          id={topicInputId}
          className="input"
          name="topic"
          value={topicId}
          onChange={(event) => setTopicId(event.target.value)}
        >
          <option value="">No topic</option>
          {repositorySnapshot.topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>
      <div className="field field-minutes">
        <label className="field-label" htmlFor={minutesInputId}>
          Minutes
        </label>
        <input
          id={minutesInputId}
          className="input"
          name="estimated-minutes"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="25"
          value={estimatedMinutes}
          onChange={(event) => setEstimatedMinutes(event.target.value)}
        />
      </div>
      <button type="submit" className="button button-primary">
        <Icon name="plus" />
        Add task
      </button>
    </form>
  )
}
