import type { JSX } from 'react'
import { Link } from 'react-router'

import { Icon } from '../../components/Icon'
import { EmptyState } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import type { SolveSession } from '../../domain/personal-types'
import { dueProblems } from '../../domain/review-schedule'
import { plural } from '../../lib/format'
import { SCHEDULE_SUMMARY, ScheduledList } from '../review/ScheduledList'

const VISIBLE_ITEMS = 5

export function ReviewCard({ sessions, now }: { readonly sessions: readonly SolveSession[]; readonly now: Date }): JSX.Element {
  const items = dueProblems(repositorySnapshot.problems, sessions, now)

  return (
    <section className="card" aria-labelledby="review-card-heading">
      <div className="card-header">
        <h2 id="review-card-heading">Due for review</h2>
        <Link className="text-link" to="/review">
          Review all
          <Icon name="arrowRight" size={14} className="icon-trailing" />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Nothing due" compact>
          {SCHEDULE_SUMMARY}
        </EmptyState>
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
