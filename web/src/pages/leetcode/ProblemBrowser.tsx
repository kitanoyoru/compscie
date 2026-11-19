import { useId, useMemo, useState, type JSX } from 'react'

import { Icon } from '../../components/Icon'
import { DIFFICULTY_LABELS, DifficultyBadge, EmptyState, ProgressBadge, formatCount } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import type { SolvedProblem } from '../../data/types'
import { problemProgress, rankCounts } from '../../domain/insights'
import type { SolveSession } from '../../domain/personal-types'
import { FILTER_ALL } from '../../domain/recommendations'
import { formatProblemNumber } from '../../lib/format'
import type { DifficultyFilter, LeetCodeParams } from './useLeetCodeParams'

const PAGE_SIZE = 40
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = [FILTER_ALL, 'easy', 'medium', 'hard']

const allProblems = repositorySnapshot.problems
const languageOptions = rankCounts(allProblems.flatMap((problem) => problem.languages)).sort(
  (left, right) => left.label.localeCompare(right.label),
)
const tagOptions = rankCounts(allProblems.flatMap((problem) => problem.tags)).sort((left, right) =>
  left.label.localeCompare(right.label),
)

interface ProblemBrowserProps {
  readonly params: LeetCodeParams
  readonly query: string
  readonly onQueryChange: (query: string) => void
  readonly problems: readonly SolvedProblem[]
  readonly selectedId: number | undefined
  readonly latestSessions: ReadonlyMap<number, SolveSession>
  readonly onSelect: (problemId: number) => void
}

export function ProblemBrowser({
  params,
  query,
  onQueryChange,
  problems,
  selectedId,
  latestSessions,
  onSelect,
}: ProblemBrowserProps): JSX.Element {
  const searchId = useId()
  const languageId = useId()
  const tagId = useId()
  const [shown, setShown] = useState(PAGE_SIZE)
  const visible = useMemo(() => problems.slice(0, shown), [problems, shown])
  const filtered =
    query.trim() !== '' ||
    params.difficulty !== FILTER_ALL ||
    params.language !== FILTER_ALL ||
    params.tag !== FILTER_ALL

  function changeFilter(patch: Parameters<LeetCodeParams['update']>[0]): void {
    setShown(PAGE_SIZE)
    params.update(patch)
  }

  function clearFilters(): void {
    setShown(PAGE_SIZE)
    onQueryChange('')
    params.update({ difficulty: null, language: null, tag: null })
  }

  return (
    <section className="card browser" aria-labelledby="browser-heading">
      <div className="card-header">
        <div>
          <h2 id="browser-heading">Solved problems</h2>
          <p className="card-subtitle" aria-live="polite">
            {formatCount(problems.length)} of {formatCount(allProblems.length)} match
          </p>
        </div>
        {filtered && (
          <button type="button" className="text-button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="browser-filters">
        <div className="search-field">
          <Icon name="search" />
          <label className="sr-only" htmlFor={searchId}>
            Search problems
          </label>
          <input
            id={searchId}
            className="input"
            type="search"
            placeholder="Search by number or title"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setShown(PAGE_SIZE)
              onQueryChange(event.target.value)
            }}
          />
        </div>

        <div className="segmented-control" role="group" aria-label="Difficulty">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={params.difficulty === option}
              onClick={() => changeFilter({ difficulty: option })}
            >
              {option !== FILTER_ALL && <span className="swatch" data-difficulty={option} aria-hidden="true" />}
              {option === FILTER_ALL ? 'All' : DIFFICULTY_LABELS[option]}
            </button>
          ))}
        </div>

        <div className="filter-selects">
          <div className="field">
            <label className="field-label" htmlFor={languageId}>
              Language
            </label>
            <select
              id={languageId}
              className="input"
              value={params.language}
              onChange={(event) => changeFilter({ language: event.target.value })}
            >
              <option value={FILTER_ALL}>All languages</option>
              {languageOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor={tagId}>
              Pattern
            </label>
            <select
              id={tagId}
              className="input"
              value={params.tag}
              onChange={(event) => changeFilter({ tag: event.target.value })}
            >
              <option value={FILTER_ALL}>All patterns</option>
              {tagOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {problems.length === 0 ? (
        <EmptyState title="No solved problems match">
          Try a different pattern or language, or clear the filters.
        </EmptyState>
      ) : (
        <ul className="problem-list" aria-label="Matching problems">
          {visible.map((problem) => {
            const progress = problemProgress(problem.id, latestSessions)
            const extraLanguages = problem.languages.length - 3

            return (
              <li key={problem.id}>
                <button
                  type="button"
                  className="problem-row"
                  aria-pressed={problem.id === selectedId}
                  aria-label={`${problem.title}, problem ${problem.id}, ${DIFFICULTY_LABELS[problem.difficulty]}${
                    progress === 'needs-review' ? ', needs review' : progress === 'success' ? ', solved' : ''
                  }`}
                  onClick={() => onSelect(problem.id)}
                >
                  <span className="problem-number">{formatProblemNumber(problem.id)}</span>
                  <span className="problem-main">
                    <span className="problem-title">{problem.title}</span>
                    <span className="problem-languages">
                      {problem.languages.slice(0, 3).join(' · ')}
                      {extraLanguages > 0 && ` +${extraLanguages}`}
                    </span>
                  </span>
                  <span className="problem-badges">
                    <ProgressBadge progress={progress} />
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {problems.length > shown && (
        <button
          type="button"
          className="button button-secondary button-block"
          onClick={() => setShown((count) => count + PAGE_SIZE)}
        >
          Show {Math.min(PAGE_SIZE, problems.length - shown)} more
          <span className="button-hint">{formatCount(problems.length - shown)} hidden</span>
        </button>
      )}
    </section>
  )
}
