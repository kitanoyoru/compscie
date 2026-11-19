import type { JSX } from 'react'

import { TaskList } from '../components/TaskList'
import { usePageTitle } from '../components/RouteEffects'
import { PageHeader } from '../components/ui'
import { repositorySnapshot } from '../data/generated/repository'
import { getTodayRecommendation } from '../domain/recommendations'
import { formatLongDay } from '../lib/format'
import { useLearningState } from '../state/learning-state'
import { NextActionCard } from './today/NextActionCard'
import { ReviewCard } from './today/ReviewCard'
import { WeekCard } from './today/WeekCard'

export function TodayPage(): JSX.Element {
  usePageTitle('Today')
  const state = useLearningState()
  const now = new Date()
  const recommendation = getTodayRecommendation(repositorySnapshot, state)

  return (
    <div className="page">
      <PageHeader
        eyebrow={formatLongDay(now)}
        title="Today"
        titleId="today-heading"
        description="One next action, a short queue, and steady weekly progress."
      />

      <div className="today-grid">
        <div className="stack">
          <NextActionCard recommendation={recommendation} tasks={state.tasks} />
          <TaskList
            tasks={state.tasks}
            recommendedTaskId={recommendation.kind === 'task' ? recommendation.taskId : undefined}
          />
        </div>
        <aside className="stack" aria-label="Progress">
          <WeekCard state={state} now={now} />
          <ReviewCard sessions={state.sessions} />
        </aside>
      </div>
    </div>
  )
}
