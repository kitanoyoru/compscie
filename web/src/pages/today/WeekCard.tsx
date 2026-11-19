import type { JSX } from 'react'

import { WeekStrip } from '../../components/charts'
import {
  activityByDayThisIsoWeek,
  activityStreak,
  countSessionsThisIsoWeek,
} from '../../domain/insights'
import type { PersonalLearningState } from '../../domain/personal-types'
import { countCompletedThisIsoWeek } from '../../domain/recommendations'
import { localDayKey } from '../../lib/calendar'
import { formatDay, plural } from '../../lib/format'

interface WeekCardProps {
  readonly state: PersonalLearningState
  readonly now: Date
}

export function WeekCard({ state, now }: WeekCardProps): JSX.Element {
  const completed = countCompletedThisIsoWeek(state.tasks, now)
  const days = activityByDayThisIsoWeek(state.tasks, state.sessions, now)
  const sessions = countSessionsThisIsoWeek(state.sessions, now)
  const streak = activityStreak(state.tasks, state.sessions, now)
  const firstDay = days[0]?.date
  const lastDay = days.at(-1)?.date

  return (
    <section className="card week-card" aria-labelledby="week-heading">
      <div className="card-header">
        <h2 id="week-heading">This week</h2>
        {firstDay !== undefined && lastDay !== undefined && (
          <p className="card-subtitle">
            {formatDay(firstDay, now)} – {formatDay(lastDay, now)}
          </p>
        )}
      </div>
      <p className="hero-figure">
        <span className="hero-figure-value">{completed}</span>{' '}
        <span className="hero-figure-label">{completed === 1 ? 'task' : 'tasks'} completed</span>
      </p>
      <WeekStrip days={days} today={localDayKey(now) ?? ''} />
      <dl className="mini-stats">
        <div>
          <dt>Practice sessions</dt>
          <dd>{sessions}</dd>
        </div>
        <div>
          <dt>Streak</dt>
          <dd>{plural(streak, 'day')}</dd>
        </div>
      </dl>
    </section>
  )
}
