import { useMemo, type JSX } from 'react'

import { SegmentedBar } from '../components/charts'
import { usePageTitle } from '../components/RouteEffects'
import { DIFFICULTY_LABELS, EmptyState, PageHeader, formatCount } from '../components/ui'
import { repositorySnapshot } from '../data/generated/repository'
import type { SolvedProblem } from '../data/types'
import { difficultyCounts, latestSessionByProblem, sessionsForProblem } from '../domain/insights'
import { choosePracticeProblem, filterProblems } from '../domain/recommendations'
import { dueProblems } from '../domain/review-schedule'
import { useLearningState } from '../state/learning-state'
import { ProblemBrowser } from './leetcode/ProblemBrowser'
import { SessionPanel } from './leetcode/SessionPanel'
import { useLeetCodeParams } from './leetcode/useLeetCodeParams'

const allProblems = repositorySnapshot.problems
const problemsById = new Map<number, SolvedProblem>(allProblems.map((problem) => [problem.id, problem]))
const totals = difficultyCounts(allProblems)
const difficultySegments = (['easy', 'medium', 'hard'] as const).map((difficulty) => ({
  key: difficulty,
  label: DIFFICULTY_LABELS[difficulty],
  value: totals[difficulty],
}))

function revealSessionPanel(): void {
  if (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 63.99rem)').matches) {
    document.getElementById('session-heading')?.scrollIntoView?.({ block: 'start', behavior: 'smooth' })
  }
}

export function LeetCodePage(): JSX.Element {
  usePageTitle('LeetCode')
  const { sessions } = useLearningState()
  const params = useLeetCodeParams()
  const { difficulty, language, tag, query } = params

  const problems = useMemo(
    () => filterProblems(allProblems, { difficulty, language, tag, query }),
    [difficulty, language, tag, query],
  )
  const now = new Date()
  const latestSessions = useMemo(() => latestSessionByProblem(sessions), [sessions])
  // Cheap (sessions are few), and recomputing each render keeps it right across midnight.
  const dueIds = new Set(dueProblems(allProblems, sessions, now).map((item) => item.problem.id))
  const suggested = choosePracticeProblem(problems, sessions, now)
  const pinned = params.problemId === undefined ? undefined : problemsById.get(params.problemId)
  const selected = pinned ?? suggested
  const reviewedCount = latestSessions.size

  function selectProblem(problemId: number): void {
    params.update({ problem: String(problemId) })
    revealSessionPanel()
  }

  return (
    <div className="page">
      <PageHeader
        title="LeetCode"
        titleId="leetcode-heading"
        aside={
          <div className="header-stats">
            <p className="header-stat">
              <span className="header-stat-value">{formatCount(allProblems.length)}</span> solved
            </p>
            <SegmentedBar segments={difficultySegments} label="Solved problems by difficulty" />
            <p className="header-stat-note">
              {formatCount(reviewedCount)} reviewed here · {formatCount(dueIds.size)} due for review
            </p>
          </div>
        }
      />

      <div className="leetcode-grid">
        <div className="session-column">
          {selected === undefined ? (
            <section className="card" aria-labelledby="session-heading">
              <h2 id="session-heading">Nothing to practice</h2>
              <EmptyState title="No solved problems match these filters">
                Loosen the filters to get a suggestion.
              </EmptyState>
            </section>
          ) : (
            <SessionPanel
              problem={selected}
              history={sessionsForProblem(sessions, selected.id)}
              suggested={pinned === undefined}
              onBackToSuggestion={() => params.update({ problem: null })}
              onSaved={(problemId) => params.update({ problem: String(problemId) })}
            />
          )}
        </div>
        <ProblemBrowser
          params={params}
          problems={problems}
          selectedId={selected?.id}
          latestSessions={latestSessions}
          dueIds={dueIds}
          onSelect={selectProblem}
        />
      </div>
    </div>
  )
}
