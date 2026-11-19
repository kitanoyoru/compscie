import { useMemo, type JSX } from 'react'

import { SegmentedBar } from '../components/charts'
import { usePageTitle } from '../components/RouteEffects'
import { DIFFICULTY_LABELS, EmptyState, PageHeader, formatCount } from '../components/ui'
import { repositorySnapshot } from '../data/generated/repository'
import type { SolvedProblem } from '../data/types'
import { difficultyCounts, latestSessionByProblem, sessionsForProblem } from '../domain/insights'
import { choosePracticeProblem, filterProblems } from '../domain/recommendations'
import { useLearningState } from '../state/learning-state'
import { ProblemBrowser } from './leetcode/ProblemBrowser'
import { RecentReflections } from './leetcode/RecentReflections'
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
  const latestSessions = useMemo(() => latestSessionByProblem(sessions), [sessions])
  const suggested = choosePracticeProblem(problems, sessions)
  const pinned = params.problemId === undefined ? undefined : problemsById.get(params.problemId)
  const selected = pinned ?? suggested
  const reviewedCount = latestSessions.size
  const needsReviewCount = [...latestSessions.values()].filter(
    (session) => session.outcome === 'needs-review',
  ).length

  function selectProblem(problemId: number): void {
    params.update({ problem: String(problemId) })
    revealSessionPanel()
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="LeetCode review"
        title="Practice that sticks"
        titleId="leetcode-heading"
        description="Revisit problems you have already solved, time a fresh attempt, and keep the one insight worth remembering."
        aside={
          <div className="header-stats">
            <p className="header-stat">
              <span className="header-stat-value">{formatCount(allProblems.length)}</span> solved
            </p>
            <SegmentedBar segments={difficultySegments} label="Solved problems by difficulty" />
            <p className="header-stat-note">
              {formatCount(reviewedCount)} reviewed here · {formatCount(needsReviewCount)} need review
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
          onSelect={selectProblem}
        />
      </div>

      <RecentReflections sessions={sessions} problemsById={problemsById} onSelect={selectProblem} />
    </div>
  )
}
