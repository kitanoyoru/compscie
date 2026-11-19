import type { JSX } from 'react'
import { Link } from 'react-router'

import { Icon } from '../../components/Icon'
import { DifficultyBadge, EmptyState } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import type { SolveSession } from '../../domain/personal-types'
import { reviewQueue } from '../../domain/insights'
import { formatProblemNumber, formatRelativeDay } from '../../lib/format'

const VISIBLE_ITEMS = 5

export function ReviewCard({ sessions }: { readonly sessions: readonly SolveSession[] }): JSX.Element {
  const items = reviewQueue(repositorySnapshot.problems, sessions)

  return (
    <section className="card" aria-labelledby="review-heading">
      <div className="card-header">
        <h2 id="review-heading">Due for review</h2>
        <Link className="text-link" to="/leetcode">
          Practice
          <Icon name="arrowRight" size={14} className="icon-trailing" />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Nothing flagged">
          Problems you mark “needs review” in the LeetCode workspace land here.
        </EmptyState>
      ) : (
        <>
          <ul className="review-list">
            {items.slice(0, VISIBLE_ITEMS).map(({ problem, session }) => (
              <li key={problem.id}>
                <Link className="review-link" to={`/leetcode?problem=${problem.id}`}>
                  <span className="problem-number">{formatProblemNumber(problem.id)}</span>
                  <span className="review-title">{problem.title}</span>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </Link>
                <span className="review-when">{formatRelativeDay(session.endedAt)}</span>
              </li>
            ))}
          </ul>
          {items.length > VISIBLE_ITEMS && (
            <p className="card-footnote">
              {items.length - VISIBLE_ITEMS} more waiting in the LeetCode workspace.
            </p>
          )}
        </>
      )}
    </section>
  )
}
