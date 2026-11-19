import { useEffect, useId, useMemo, useRef, useState, type JSX } from 'react'

import { Icon } from '../../components/Icon'
import { LanguageIcon, LanguageIconList } from '../../components/LanguageIcon'
import { DIFFICULTY_LABELS, DifficultyBadge, EmptyState, ProgressBadge, formatCount } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import type { SolvedProblem } from '../../data/types'
import { problemProgress, rankCounts } from '../../domain/insights'
import type { SolveSession } from '../../domain/personal-types'
import { FILTER_ALL } from '../../domain/recommendations'
import { formatProblemNumber, plural } from '../../lib/format'
import { isModalOpen, isTypingTarget } from '../../lib/keyboard'
import type { DifficultyFilter, LeetCodeParams } from './useLeetCodeParams'

const PAGE_SIZE = 40
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = [FILTER_ALL, 'easy', 'medium', 'hard']

const allProblems = repositorySnapshot.problems
// Most-used languages first, so the chips read like the Knowledge Map chart.
const languageOptions = rankCounts(allProblems.flatMap((problem) => problem.languages))
const tagOptions = rankCounts(allProblems.flatMap((problem) => problem.tags)).sort((left, right) =>
  left.label.localeCompare(right.label),
)

interface ProblemBrowserProps {
  readonly params: LeetCodeParams
  readonly problems: readonly SolvedProblem[]
  readonly selectedId: number | undefined
  readonly latestSessions: ReadonlyMap<number, SolveSession>
  readonly onSelect: (problemId: number) => void
}

export function ProblemBrowser({
  params,
  problems,
  selectedId,
  latestSessions,
  onSelect,
}: ProblemBrowserProps): JSX.Element {
  const searchId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const { query } = params
  const [draft, setDraft] = useState(query)

  // Values written to the URL whose echo has not come back yet. Router updates commit in a
  // transition, so a stale echo ("a") can arrive after the draft already moved on ("ab").
  const pendingWrites = useRef<string[]>([])

  function writeQuery(value: string): void {
    pendingWrites.current.push(value)
    setDraft(value)
    params.update({ q: value })
  }

  // Re-sync from the URL only for external changes (Clear filters, back/forward, deep link).
  useEffect(() => {
    const echoIndex = pendingWrites.current.indexOf(query)
    if (echoIndex !== -1) {
      pendingWrites.current.splice(0, echoIndex + 1)
      return
    }
    pendingWrites.current = []
    setDraft(query)
  }, [query])
  const languageId = useId()
  const tagId = useId()
  const [shown, setShown] = useState(PAGE_SIZE)
  const visible = useMemo(() => problems.slice(0, shown), [problems, shown])
  const filtered =
    query.trim() !== '' ||
    params.difficulty !== FILTER_ALL ||
    params.language !== FILTER_ALL ||
    params.tag !== FILTER_ALL

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (
        event.key !== '/' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        isTypingTarget(event.target) ||
        isModalOpen()
      ) {
        return
      }

      const search = searchRef.current
      if (search === null) {
        return
      }

      event.preventDefault()
      search.focus()
      search.select()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function changeFilter(patch: Parameters<LeetCodeParams['update']>[0]): void {
    setShown(PAGE_SIZE)
    params.update(patch)
  }

  function clearFilters(): void {
    setShown(PAGE_SIZE)
    params.update({ q: null, difficulty: null, language: null, tag: null })
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
            aria-keyshortcuts="/"
            ref={searchRef}
            value={draft}
            onChange={(event) => {
              setShown(PAGE_SIZE)
              writeQuery(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || event.keyCode === 229) {
                return
              }
              if (event.key === 'Escape' && (draft !== '' || query !== '')) {
                event.preventDefault()
                setShown(PAGE_SIZE)
                writeQuery('')
              }
            }}
          />
          <kbd className="search-hint" aria-hidden="true">
            /
          </kbd>
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

        <div className="field language-filter">
          <span className="field-label" id={languageId}>
            Language
          </span>
          <div className="language-chips" role="group" aria-labelledby={languageId}>
            <button
              type="button"
              className="language-chip"
              aria-pressed={params.language === FILTER_ALL}
              onClick={() => changeFilter({ language: null })}
            >
              All
            </button>
            {languageOptions.map((option) => {
              const name = `${option.label}, ${plural(option.count, 'problem')}`
              const pressed = params.language === option.label

              return (
                <button
                  key={option.label}
                  type="button"
                  className="language-chip"
                  aria-pressed={pressed}
                  aria-label={name}
                  title={name}
                  onClick={() => changeFilter({ language: pressed ? null : option.label })}
                >
                  <LanguageIcon language={option.label} decorative />
                  <span className="language-chip-count" aria-hidden="true">
                    {formatCount(option.count)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-selects">
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

            return (
              <li key={problem.id}>
                <button
                  type="button"
                  className="problem-row"
                  aria-pressed={problem.id === selectedId}
                  aria-label={`${problem.title}, problem ${problem.id}, ${DIFFICULTY_LABELS[problem.difficulty]}${
                    progress === 'needs-review' ? ', needs review' : progress === 'success' ? ', solved' : ''
                  }, solutions in ${problem.languages.join(', ')}`}
                  onClick={() => onSelect(problem.id)}
                >
                  <span className="problem-number">{formatProblemNumber(problem.id)}</span>
                  <span className="problem-main">
                    <span className="problem-title">{problem.title}</span>
                    <span className="problem-languages">
                      <LanguageIconList languages={problem.languages} max={5} size={14} decorative />
                    </span>
                    <span className="problem-badges">
                      <ProgressBadge progress={progress} />
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </span>
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
