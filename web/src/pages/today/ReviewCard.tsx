import type { JSX } from 'react'
import { Link } from 'react-router'

import { Icon } from '../../components/Icon'
import { EmptyState } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import type { SolveSession } from '../../domain/personal-types'
import type { CardReview } from '../../domain/personal-types'
import { quizQueue } from '../../domain/quiz'
import { dueProblems } from '../../domain/review-schedule'
import { plural } from '../../lib/format'
import { SCHEDULE_SUMMARY, ScheduledList } from '../review/ScheduledList'

const VISIBLE_ITEMS = 5

interface ReviewCardProps {
  readonly sessions: readonly SolveSession[]
  readonly cardReviews: readonly CardReview[]
  readonly now: Date
}

export function ReviewCard({ sessions, cardReviews, now }: ReviewCardProps): JSX.Element {
  const items = dueProblems(repositorySnapshot.problems, sessions, now)
  const questions = quizQueue(repositorySnapshot, cardReviews, now).due.length

  return (
    <section className="card" aria-labelledby="review-card-heading">
      <div className="card-header">
        <div>
          <h2 id="review-card-heading">Due for review</h2>
          {(items.length > 0 || questions > 0) && (
            <p className="card-subtitle">
              {plural(items.length, 'problem')} · {plural(questions, 'question')} due
            </p>
          )}
        </div>
        <Link className="text-link" to="/review">
          Review all
          <Icon name="arrowRight" size={14} className="icon-trailing" />
        </Link>
      </div>

      {items.length === 0 && questions === 0 ? (
        <EmptyState title="Nothing due" compact>
          {SCHEDULE_SUMMARY}
        </EmptyState>
      ) : items.length === 0 ? (
        <p className="empty-line">
          No problems due. Answer the note questions on the <Link to="/review">Review page</Link>.
        </p>
      ) : (
        <>
          <ScheduledList
            items={items.slice(0, VISIBLE_ITEMS)}
            now={now}
            due
            label="Problems due for review"
            showLanguages={false}
          />
          {items.length > VISIBLE_ITEMS && (
            <p className="card-footnote">{plural(items.length - VISIBLE_ITEMS, 'more problem')} due on the Review page.</p>
          )}
        </>
      )}
    </section>
  )
}
