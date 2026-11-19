import type { JSX } from 'react'
import { Link } from 'react-router'

import { Icon } from '../../components/Icon'
import { findTopic, topicTitle } from '../../data/topics'
import type { LearningTask } from '../../domain/personal-types'
import type { TodayRecommendation } from '../../domain/recommendations'
import { formatRelativeDay } from '../../lib/format'
import { useLearningDispatch } from '../../state/learning-state'

interface NextActionCardProps {
  readonly recommendation: TodayRecommendation
  readonly tasks: readonly LearningTask[]
}

export function NextActionCard({ recommendation, tasks }: NextActionCardProps): JSX.Element {
  const dispatch = useLearningDispatch()

  return (
    <section className="card next-action" aria-labelledby="next-action-heading">
      <p className="eyebrow eyebrow-accent">
        <Icon name="target" size={14} />
        Up next
      </p>

      <div aria-live="polite">
        {recommendation.kind === 'task' && (
          <TaskAction
            recommendation={recommendation}
            task={tasks.find((task) => task.id === recommendation.taskId)}
            onComplete={() => dispatch({ type: 'taskCompleted', taskId: recommendation.taskId })}
            onDefer={() => dispatch({ type: 'taskDeferred', taskId: recommendation.taskId })}
          />
        )}

        {recommendation.kind === 'topic' && (
          <TopicAction
            recommendation={recommendation}
            onQueue={() =>
              dispatch({
                type: 'taskAdded',
                title: recommendation.next,
                topicId: recommendation.topicSlug,
              })
            }
          />
        )}

        {recommendation.kind === 'none' && (
          <>
            <h2 id="next-action-heading" className="next-action-title">
              Nothing queued yet
            </h2>
            <p className="next-action-meta">Add a task below and it becomes your next action.</p>
          </>
        )}
      </div>
    </section>
  )
}

interface TopicActionProps {
  readonly recommendation: Extract<TodayRecommendation, { kind: 'topic' }>
  readonly onQueue: () => void
}

function TopicAction({ recommendation, onQueue }: TopicActionProps): JSX.Element {
  const lastNote = findTopic(recommendation.topicSlug)?.lastNote ?? null

  return (
    <>
      <h2 id="next-action-heading" className="next-action-title">
        {recommendation.next}
      </h2>
      <p className="next-action-meta">
        <span>
          Next step in <strong>{recommendation.title}</strong>
        </span>
        {lastNote !== null && <span className="meta-dot">Last note {formatRelativeDay(lastNote)}</span>}
      </p>
      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onQueue}>
          <Icon name="plus" />
          Add to queue
        </button>
        <Link className="button button-secondary" to="/map">
          <Icon name="map" />
          View topic
        </Link>
      </div>
    </>
  )
}

interface TaskActionProps {
  readonly recommendation: Extract<TodayRecommendation, { kind: 'task' }>
  readonly task: LearningTask | undefined
  readonly onComplete: () => void
  readonly onDefer: () => void
}

function TaskAction({ recommendation, task, onComplete, onDefer }: TaskActionProps): JSX.Element {
  const topic = topicTitle(recommendation.topicId)

  return (
    <>
      <h2 id="next-action-heading" className="next-action-title">
        {recommendation.title}
      </h2>
      <p className="next-action-meta">
        <span>{task?.status === 'deferred' ? 'Deferred earlier, still waiting' : 'First in your queue'}</span>
        {topic !== undefined && <span className="tag">{topic}</span>}
        {recommendation.estimatedMinutes !== undefined && (
          <span className="meta-item">
            <Icon name="clock" size={13} />
            {recommendation.estimatedMinutes} min
          </span>
        )}
      </p>
      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onComplete}>
          <Icon name="check" />
          Mark done
        </button>
        {task?.status === 'open' && (
          <button type="button" className="button button-secondary" onClick={onDefer}>
            <Icon name="skip" />
            Defer
          </button>
        )}
      </div>
    </>
  )
}
