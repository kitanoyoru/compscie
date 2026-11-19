import { useEffect, useId, useState, type FormEvent, type JSX } from 'react'

import { Icon } from '../../components/Icon'
import { useToast } from '../../components/Toast'
import { DifficultyBadge, ExternalLink, ProgressBadge } from '../../components/ui'
import { leetcodeProblemUrl, repositoryTreeUrl } from '../../data/links'
import type { SolvedProblem } from '../../data/types'
import { sessionMinutes } from '../../domain/insights'
import type { SolveOutcome, SolveSession } from '../../domain/personal-types'
import { formatDay, formatElapsed, formatProblemNumber, formatRelativeDay, plural } from '../../lib/format'
import { useLearningDispatch } from '../../state/learning-state'

interface SessionPanelProps {
  readonly problem: SolvedProblem
  /** Sessions for this problem, most recent first. */
  readonly history: readonly SolveSession[]
  readonly suggested: boolean
  readonly onBackToSuggestion: () => void
  /** Called after a session is saved, so the page can keep this problem on screen. */
  readonly onSaved: (problemId: number) => void
}

function suggestionReason(latest: SolveSession | undefined): string {
  if (latest === undefined) {
    return 'Not reviewed in this workspace yet.'
  }

  return latest.outcome === 'needs-review'
    ? `You flagged it for review ${formatRelativeDay(latest.endedAt)}.`
    : `Last solved here ${formatRelativeDay(latest.endedAt)}, the longest time ago among your matches.`
}

export function SessionPanel({
  problem,
  history,
  suggested,
  onBackToSuggestion,
  onSaved,
}: SessionPanelProps): JSX.Element {
  const latest = history[0]

  return (
    <section className="card session-panel" aria-labelledby="session-heading">
      <div className="session-head">
        <p className="eyebrow eyebrow-accent">
          <Icon name={suggested ? 'sparkle' : 'target'} size={14} />
          {suggested ? 'Suggested next' : 'Selected problem'}
        </p>
        {!suggested && (
          <button type="button" className="text-button" onClick={onBackToSuggestion}>
            Back to suggestion
          </button>
        )}
      </div>

      <h2 id="session-heading" className="session-title" tabIndex={-1}>
        <span className="problem-number">{formatProblemNumber(problem.id)}</span> {problem.title}
      </h2>
      {suggested && <p className="session-reason">{suggestionReason(latest)}</p>}

      <div className="chip-row">
        <DifficultyBadge difficulty={problem.difficulty} />
        {latest !== undefined && <ProgressBadge progress={latest.outcome} />}
        {problem.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="session-languages">Solved in {problem.languages.join(', ')}</p>

      <div className="button-row">
        <ExternalLink className="button button-secondary" href={leetcodeProblemUrl(problem)}>
          Open on LeetCode
        </ExternalLink>
        <ExternalLink className="button button-quiet" href={repositoryTreeUrl(problem.path)}>
          My solutions
        </ExternalLink>
      </div>

      <SessionRecorder key={problem.id} problem={problem} onSaved={onSaved} />
      <SessionHistory history={history} />
    </section>
  )
}

interface SessionRecorderProps {
  readonly problem: SolvedProblem
  readonly onSaved: (problemId: number) => void
}

function SessionRecorder({ problem, onSaved }: SessionRecorderProps): JSX.Element {
  const dispatch = useLearningDispatch()
  const reflectionId = useId()
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [outcome, setOutcome] = useState<SolveOutcome>('success')
  const [reflection, setReflection] = useState('')
  const [status, setStatus] = useState('')
  const running = startedAt !== null

  useEffect(() => {
    if (startedAt === null) {
      return undefined
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(interval)
  }, [startedAt])

  function startTimer(): void {
    const time = Date.now()

    setStartedAt(time)
    setNow(time)
    setStatus('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const text = reflection.trim()

    if (text === '') {
      return
    }

    const endedAt = new Date()
    const session: SolveSession = {
      problemId: problem.id,
      startedAt: new Date(startedAt ?? endedAt.getTime()).toISOString(),
      endedAt: endedAt.toISOString(),
      outcome,
      reflection: text,
    }
    const minutes = sessionMinutes(session)

    dispatch({ type: 'sessionCompleted', session })
    onSaved(problem.id)
    setReflection('')
    setStartedAt(null)
    setStatus(
      `Session saved${minutes === undefined ? '' : ` · ${plural(minutes, 'minute')}`} · ${
        outcome === 'success' ? 'solved' : 'needs review'
      }`,
    )
  }

  return (
    <form className="session-form" onSubmit={handleSubmit} aria-label="Record a practice session">
      <div className="timer" data-running={running ? 'true' : undefined}>
        <Icon name="clock" size={18} />
        <span className="timer-value" role="timer" aria-label="Elapsed time">
          {formatElapsed(running ? now - startedAt : 0)}
        </span>
        {running ? (
          <button type="button" className="button button-quiet button-small" onClick={() => setStartedAt(null)}>
            <Icon name="stop" size={14} />
            Reset timer
          </button>
        ) : (
          <button type="button" className="button button-secondary button-small" onClick={startTimer}>
            <Icon name="play" size={14} />
            Start timer
          </button>
        )}
      </div>

      <fieldset className="outcome-field">
        <legend className="field-label">Outcome</legend>
        <div className="segmented-control segmented-control-wide">
          <label>
            <input
              type="radio"
              name="outcome"
              value="success"
              checked={outcome === 'success'}
              onChange={() => setOutcome('success')}
            />
            <span>
              <Icon name="check" size={14} />
              Solved cleanly
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="outcome"
              value="needs-review"
              checked={outcome === 'needs-review'}
              onChange={() => setOutcome('needs-review')}
            />
            <span>
              <Icon name="rotate" size={14} />
              Needs review
            </span>
          </label>
        </div>
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={reflectionId}>
          Reflection
        </label>
        <textarea
          id={reflectionId}
          className="input"
          rows={4}
          value={reflection}
          placeholder="The invariant, edge case, or trick worth remembering next time."
          onChange={(event) => setReflection(event.target.value)}
        />
      </div>

      <div className="session-actions">
        <button type="submit" className="button button-primary" disabled={reflection.trim() === ''}>
          <Icon name="check" />
          Save session
        </button>
        <p className="save-status" role="status">
          {status}
        </p>
      </div>
    </form>
  )
}

function SessionHistory({ history }: { readonly history: readonly SolveSession[] }): JSX.Element {
  const dispatch = useLearningDispatch()
  const showToast = useToast()

  function deleteSession(session: SolveSession): void {
    dispatch({ type: 'sessionDeleted', problemId: session.problemId, endedAt: session.endedAt })
    showToast({
      message: `Removed a session for #${session.problemId}`,
      action: { label: 'Undo', onAction: () => dispatch({ type: 'sessionCompleted', session }) },
    })
  }

  return (
    <div className="session-history">
      <h3 className="subheading">
        Your history
        <span className="count">{history.length}</span>
      </h3>
      {history.length === 0 ? (
        <p className="muted">No sessions recorded for this problem yet.</p>
      ) : (
        <ol className="history-list" aria-label="Session history">
          {history.map((session, index) => {
            const minutes = sessionMinutes(session)

            return (
              <li key={`${session.endedAt}-${index}`}>
                <div className="history-meta">
                  <ProgressBadge progress={session.outcome} />
                  <span>{formatDay(session.endedAt)}</span>
                  {minutes !== undefined && <span>{minutes} min</span>}
                  <button
                    type="button"
                    className="icon-button icon-button-danger"
                    aria-label={`Delete session from ${formatDay(session.endedAt)}`}
                    title="Delete session"
                    onClick={() => deleteSession(session)}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
                {session.reflection !== undefined && session.reflection !== '' && (
                  <p className="history-reflection">{session.reflection}</p>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
