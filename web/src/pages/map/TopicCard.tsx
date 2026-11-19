import { useState, type JSX } from 'react'

import { Icon } from '../../components/Icon'
import { ExternalLink } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import { repositoryFileUrl } from '../../data/links'
import { mapRelationships, type TopicRelationship } from '../../data/map-relationships'
import type { TopicStatus, TopicSummary } from '../../data/types'
import { cleanTitle, daysBetween, formatDay, formatRelativeDay, plural } from '../../lib/format'
import { useLearningDispatch, useLearningState } from '../../state/learning-state'

const VISIBLE_NOTES = 6
const STALE_AFTER_DAYS = 30

const STATUS_LABELS: Record<TopicStatus, string> = {
  active: 'Active',
  planned: 'Planned',
  paused: 'Paused',
  done: 'Done',
}

interface ConceptFanProps {
  readonly title: string
  readonly noteCount: number
  readonly concepts: readonly string[]
  readonly activeConcept: string | null
  readonly onToggle: (concept: string) => void
}

/** The topic node on the left, its curated concepts on the right, joined by curved links. */
function ConceptFan({ title, noteCount, concepts, activeConcept, onToggle }: ConceptFanProps): JSX.Element | null {
  if (concepts.length === 0) {
    return null
  }

  const rowHeight = 36
  const height = concepts.length * rowHeight

  return (
    <div className="concept-fan">
      <div className="fan-topic" aria-hidden="true">
        <span className="fan-topic-title">{title}</span>
        <span className="fan-topic-meta">{plural(noteCount, 'note')}</span>
      </div>
      <svg
        className="fan-links"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        aria-hidden="true"
        focusable="false"
      >
        {concepts.map((concept, index) => {
          const y = index * rowHeight + rowHeight / 2

          return (
            <path
              key={concept}
              data-active={concept === activeConcept}
              d={`M 0 ${height / 2} C 55 ${height / 2}, 45 ${y}, 100 ${y}`}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      <ul className="fan-concepts" aria-label={`Concepts connected to ${title}`}>
        {concepts.map((concept) => {
          const active = concept === activeConcept

          return (
            <li key={concept} style={{ height: rowHeight }}>
              <button
                type="button"
                className="fan-concept"
                aria-pressed={active}
                onClick={() => onToggle(concept)}
              >
                <span className="fan-node" aria-hidden="true" />
                {concept}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function TopicCard({ topic, now }: { readonly topic: TopicSummary; readonly now: Date }): JSX.Element {
  const dispatch = useLearningDispatch()
  const { tasks } = useLearningState()
  const [expanded, setExpanded] = useState(false)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const headingId = `topic-${topic.slug}-heading`
  const notes = repositorySnapshot.notes.filter((note) => note.topicSlug === topic.slug)
  const relationships: readonly TopicRelationship[] = mapRelationships.filter(
    (relationship) => relationship.topic === topic.slug,
  )
  const concepts = relationships.map((relationship) => relationship.concept)
  const activeRelationship = relationships.find((relationship) => relationship.concept === activeConcept)
  const filteredNotes =
    activeRelationship === undefined
      ? notes
      : notes.filter((note) => activeRelationship.notes.includes(note.path))
  const visibleNotes =
    activeRelationship !== undefined || expanded ? filteredNotes : notes.slice(0, VISIBLE_NOTES)
  const queued = tasks.some(
    (task) => task.status !== 'completed' && task.title.trim() === topic.next.trim(),
  )
  const daysSinceNote = topic.lastNote === null ? undefined : daysBetween(topic.lastNote, now)
  const stale = topic.status === 'active' && daysSinceNote !== undefined && daysSinceNote > STALE_AFTER_DAYS

  return (
    <article className="card topic-card" aria-labelledby={headingId}>
      <div className="topic-head">
        <div>
          <h2 id={headingId}>{topic.title}</h2>
          {topic.focus !== '' && <p className="topic-focus">{topic.focus}</p>}
        </div>
        <span className="badge" data-topic-status={topic.status}>
          <span className="swatch" aria-hidden="true" />
          {STATUS_LABELS[topic.status]}
        </span>
      </div>

      <ConceptFan
        title={topic.title}
        noteCount={topic.noteCount}
        concepts={concepts}
        activeConcept={activeRelationship?.concept ?? null}
        onToggle={(concept) => setActiveConcept((current) => (current === concept ? null : concept))}
      />

      {topic.next !== '' && (
        <div className="next-step">
          <div>
            <p className="eyebrow">Next step</p>
            <p className="next-step-text">{topic.next}</p>
          </div>
          {queued ? (
            <span className="badge" data-status="good">
              <Icon name="check" size={14} />
              In your queue
            </span>
          ) : (
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => dispatch({ type: 'taskAdded', title: topic.next, topicId: topic.slug })}
            >
              <Icon name="plus" size={14} />
              Add to queue
            </button>
          )}
        </div>
      )}

      <dl className="topic-facts">
        <div>
          <dt>Started</dt>
          <dd>{formatDay(topic.started, now)}</dd>
        </div>
        <div>
          <dt>Last note</dt>
          <dd>
            {topic.lastNote === null ? 'None yet' : formatRelativeDay(topic.lastNote, now)}
            {stale && (
              <span className="badge badge-compact" data-status="warning">
                <Icon name="warning" size={13} />
                Stale
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{topic.noteCount}</dd>
        </div>
      </dl>

      {notes.length > 0 && (
        <div className="topic-notes">
          <h3 className="subheading">
            Notes
            <span className="count">
              {activeRelationship === undefined
                ? notes.length
                : `${filteredNotes.length} of ${notes.length}`}
            </span>
          </h3>
          <ol
            className="note-list"
            aria-label={activeRelationship === undefined ? 'Notes' : `Notes about ${activeRelationship.concept}`}
          >
            {visibleNotes.map((note) => (
              <li key={note.path}>
                <ExternalLink className="note-link" href={repositoryFileUrl(note.path)}>
                  {cleanTitle(note.title)}
                </ExternalLink>
                <span className="note-date">{formatDay(note.date, now)}</span>
              </li>
            ))}
          </ol>
          {activeRelationship !== undefined && (
            <button type="button" className="text-button" onClick={() => setActiveConcept(null)}>
              Show all notes
            </button>
          )}
          {activeRelationship === undefined && notes.length > VISIBLE_NOTES && (
            <button
              type="button"
              className="text-button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Show fewer notes' : `Show all ${notes.length} notes`}
            </button>
          )}
        </div>
      )}
    </article>
  )
}
