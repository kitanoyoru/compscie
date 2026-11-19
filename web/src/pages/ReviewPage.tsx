import type { JSX } from 'react'
import { Link } from 'react-router'

import { usePageTitle } from '../components/RouteEffects'
import { EmptyState, PageHeader } from '../components/ui'
import { repositorySnapshot } from '../data/generated/repository'
import type { SolvedProblem } from '../data/types'
import { quizQueue } from '../domain/quiz'
import { UPCOMING_DAYS, dueProblems, upcomingProblems } from '../domain/review-schedule'
import { plural } from '../lib/format'
import { useLearningState } from '../state/learning-state'
import { QuestionRunner } from './review/QuestionRunner'
import { RecentReflections } from './review/RecentReflections'
import { SCHEDULE_SUMMARY, ScheduledList, scheduleLabel } from './review/ScheduledList'

const allProblems = repositorySnapshot.problems
const problemsById = new Map<number, SolvedProblem>(allProblems.map((problem) => [problem.id, problem]))

export function ReviewPage(): JSX.Element {
  usePageTitle('Review')
  const { sessions, cardReviews } = useLearningState()
  const now = new Date()
  const due = dueProblems(allProblems, sessions, now)
  const upcoming = upcomingProblems(allProblems, sessions, now)
  const next = upcoming[0]
  const questionsDue = quizQueue(repositorySnapshot, cardReviews, now).due.length
  const summary =
    due.length === 0 && questionsDue === 0
      ? 'Nothing due today.'
      : `${[
          due.length > 0 ? plural(due.length, 'problem') : undefined,
          questionsDue > 0 ? plural(questionsDue, 'question') : undefined,
        ]
          .filter(Boolean)
          .join(' and ')} due today.`

  return (
    <div className="page">
      <PageHeader
        title="Review"
        titleId="review-heading"
        description={summary}
      />

      <div className="review-grid">
        <section className="card" aria-labelledby="due-heading">
          <div className="card-header">
            <div>
              <h2 id="due-heading">Problems due</h2>
              <p className="card-subtitle">{SCHEDULE_SUMMARY}</p>
            </div>
          </div>
          {due.length === 0 ? (
            <EmptyState title="Nothing due" compact>
              {next === undefined ? (
                <>
                  Practice a problem on the <Link to="/leetcode">LeetCode page</Link> to start its schedule.
                </>
              ) : (
                `Next up: ${next.problem.title}, ${scheduleLabel(next.schedule.dueDay, now, false).toLowerCase()}.`
              )}
            </EmptyState>
          ) : (
            <ScheduledList items={due} now={now} due label="Problems due" />
          )}
        </section>

        <section className="card" aria-labelledby="upcoming-heading">
          <div className="card-header">
            <div>
              <h2 id="upcoming-heading">Coming up</h2>
              <p className="card-subtitle">Due in the next {plural(UPCOMING_DAYS, 'day')}</p>
            </div>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled this week" compact />
          ) : (
            <ScheduledList items={upcoming} now={now} due={false} label="Problems coming up" />
          )}
        </section>
      </div>

      <QuestionRunner />

      <RecentReflections sessions={sessions} problemsById={problemsById} />
    </div>
  )
}
