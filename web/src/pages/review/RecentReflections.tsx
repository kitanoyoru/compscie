import type { JSX } from 'react'
import { Link } from 'react-router'

import { EmptyState, ProgressBadge } from '../../components/ui'
import type { SolvedProblem } from '../../data/types'
import { recentReflections } from '../../domain/insights'
import type { SolveSession } from '../../domain/personal-types'
import { formatProblemNumber, formatRelativeDay, plural } from '../../lib/format'

const VISIBLE_REFLECTIONS = 6

interface RecentReflectionsProps {
  readonly sessions: readonly SolveSession[]
  readonly problemsById: ReadonlyMap<number, SolvedProblem>
}

export function RecentReflections({ sessions, problemsById }: RecentReflectionsProps): JSX.Element {
  const reflections = recentReflections(sessions, VISIBLE_REFLECTIONS)

  return (
    <section className="card" aria-labelledby="reflections-heading">
      <div className="card-header">
        <div>
          <h2 id="reflections-heading">Recent reflections</h2>
          <p className="card-subtitle">{plural(sessions.length, 'session')} logged in this browser</p>
        </div>
      </div>

      {reflections.length === 0 ? (
        <EmptyState title="No reflections yet">
          Save a practice session on the LeetCode page. Its reflection shows up here and in the problem’s history.
        </EmptyState>
      ) : (
        <ul className="reflection-list">
          {reflections.map((session, index) => {
            const problem = problemsById.get(session.problemId)

            return (
              <li key={`${session.endedAt}-${index}`} className="reflection-item">
                <div className="reflection-head">
                  <Link className="text-button" to={`/leetcode?problem=${session.problemId}`}>
                    <span className="problem-number">{formatProblemNumber(session.problemId)}</span>
                    {problem?.title ?? `Problem ${session.problemId}`}
                  </Link>
                  <ProgressBadge progress={session.outcome} />
                  <span className="muted">{formatRelativeDay(session.endedAt)}</span>
                </div>
                <p className="reflection-text">{session.reflection}</p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
