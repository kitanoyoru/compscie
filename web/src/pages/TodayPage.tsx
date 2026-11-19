import type { JSX } from 'react'

import { TaskComposer } from '../components/TaskComposer'
import { TaskList } from '../components/TaskList'
import { repositorySnapshot } from '../data/generated/repository'
import { countCompletedThisIsoWeek, getTodayRecommendation } from '../domain/recommendations'
import { useLearningState } from '../state/learning-state'

export function TodayPage(): JSX.Element {
  const state = useLearningState()
  const recommendation = getTodayRecommendation(repositorySnapshot, state)
  const completedThisWeek = countCompletedThisIsoWeek(state.tasks, new Date())

  return (
    <div className="today-page">
      <section className="page-intro" aria-labelledby="today-heading">
        <p className="app-kicker">Daily learning</p>
        <h2 id="today-heading">Today</h2>
        <p className="page-lede">
          Repository notes and solved problems are read-only facts. Your task queue and practice
          history stay in this browser.
        </p>
      </section>

      <section className="recommendation-card" aria-labelledby="recommendation-heading">
        <p className="section-kicker">Next action</p>
        <h2 id="recommendation-heading">Recommended for today</h2>
        <div aria-live="polite">
          {recommendation.kind === 'task' && (
            <div className="recommendation-body">
              <h3>{recommendation.title}</h3>
              <p>
                {recommendation.estimatedMinutes !== undefined
                  ? `Estimated time: ${recommendation.estimatedMinutes} minutes`
                  : 'A task you chose for today.'}
              </p>
            </div>
          )}
          {recommendation.kind === 'topic' && (
            <div className="recommendation-body">
              <h3>{recommendation.title}</h3>
              <p>{recommendation.next}</p>
            </div>
          )}
          {recommendation.kind === 'none' && (
            <p>No active topic fallback is available.</p>
          )}
        </div>
        <p className="weekly-count">Completed this week: {completedThisWeek}</p>
      </section>

      <section className="task-section" aria-labelledby="task-composer-heading">
        <h2 id="task-composer-heading">Add a task</h2>
        <TaskComposer />
      </section>

      <TaskList
        tasks={state.tasks}
        recommendedTaskId={recommendation.kind === 'task' ? recommendation.taskId : undefined}
      />
    </div>
  )
}
