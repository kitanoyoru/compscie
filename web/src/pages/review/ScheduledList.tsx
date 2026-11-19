import type { JSX } from 'react'
import { Link } from 'react-router'

import { LanguageIconList } from '../../components/LanguageIcon'
import { DifficultyBadge } from '../../components/ui'
import { RELEARN_DAYS, REVIEW_LADDER_DAYS, type ScheduledProblem } from '../../domain/review-schedule'
import { formatProblemNumber, formatRelativeDay, plural } from '../../lib/format'

/** One sentence that explains the review ladder, built from the schedule constants. */
export const SCHEDULE_SUMMARY = `Problems come back ${plural(RELEARN_DAYS, 'day')} after “needs review”, and ${REVIEW_LADDER_DAYS.slice(0, -1).join(', ')}, then ${REVIEW_LADDER_DAYS.at(-1)} days after clean solves.`

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "Due today", "Due 3 days ago" for due items; "Tomorrow", "In 4 days" for upcoming ones. */
export function scheduleLabel(dueDay: string, now: Date, due: boolean): string {
  const relative = formatRelativeDay(dueDay, now)

  return due ? `Due ${relative}` : capitalize(relative)
}

interface ScheduledListProps {
  readonly items: readonly ScheduledProblem[]
  readonly now: Date
  /** Due items say "Due 3 days ago"; upcoming ones say "In 3 days". */
  readonly due: boolean
  readonly label: string
  /** Language icons need room; narrow cards leave them out so titles stay readable. */
  readonly showLanguages?: boolean
}

/** Problems with their review day; each links to the problem in the LeetCode workspace. */
export function ScheduledList({ items, now, due, label, showLanguages = true }: ScheduledListProps): JSX.Element {
  return (
    <ul className="review-list" aria-label={label}>
      {items.map(({ problem, schedule }) => (
        <li key={problem.id}>
          <Link className="review-link" to={`/leetcode?problem=${problem.id}`}>
            <span className="problem-number">{formatProblemNumber(problem.id)}</span>
            <span className="review-title">{problem.title}</span>
            {showLanguages && <LanguageIconList languages={problem.languages} max={3} size={14} decorative />}
            <DifficultyBadge difficulty={problem.difficulty} />
          </Link>
          <span className="review-when">{scheduleLabel(schedule.dueDay, now, due)}</span>
        </li>
      ))}
    </ul>
  )
}
