import type { JSX, Ref } from 'react'

import { repositorySnapshot } from '../data/generated/repository'

export interface TaskFieldsValue {
  readonly title: string
  readonly topicId: string
  readonly minutes: string
}

export interface TaskFieldLabels {
  readonly title: string
  readonly topic: string
  readonly minutes: string
}

interface TaskFieldsProps extends TaskFieldsValue {
  readonly onChange: (value: TaskFieldsValue) => void
  readonly idPrefix: string
  readonly labels: TaskFieldLabels
  readonly titleInputRef?: Ref<HTMLInputElement>
}

export function TaskFields({
  title,
  topicId,
  minutes,
  onChange,
  idPrefix,
  labels,
  titleInputRef,
}: TaskFieldsProps): JSX.Element {
  const value = { title, topicId, minutes }

  return (
    <>
      <div className="field field-title">
        <label className="field-label" htmlFor={`${idPrefix}-title`}>
          {labels.title}
        </label>
        <input
          id={`${idPrefix}-title`}
          ref={titleInputRef}
          className="input"
          name="title"
          value={title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
          maxLength={160}
          autoComplete="off"
          placeholder="What will you learn next?"
        />
      </div>
      <div className="field field-topic">
        <label className="field-label" htmlFor={`${idPrefix}-topic`}>
          {labels.topic}
        </label>
        <select
          id={`${idPrefix}-topic`}
          className="input"
          name="topic"
          value={topicId}
          onChange={(event) => onChange({ ...value, topicId: event.target.value })}
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
        <label className="field-label" htmlFor={`${idPrefix}-minutes`}>
          {labels.minutes}
        </label>
        <input
          id={`${idPrefix}-minutes`}
          className="input"
          name="estimated-minutes"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="25"
          value={minutes}
          onChange={(event) => onChange({ ...value, minutes: event.target.value })}
        />
      </div>
    </>
  )
}
