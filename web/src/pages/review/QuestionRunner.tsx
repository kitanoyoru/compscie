import { useEffect, useRef, useState, type JSX } from 'react'
import { Link } from 'react-router'

import { Icon } from '../../components/Icon'
import { NoteContent, useNoteContent } from '../../components/NoteContent'
import { useToast } from '../../components/Toast'
import { EmptyState } from '../../components/ui'
import { repositorySnapshot } from '../../data/generated/repository'
import { notePath } from '../../data/notes'
import { topicTitle } from '../../data/topics'
import type { SolveOutcome } from '../../domain/personal-types'
import { quizQueue } from '../../domain/quiz'
import { cleanTitle, plural } from '../../lib/format'
import { useLearningDispatch, useLearningState } from '../../state/learning-state'

/**
 * One note question at a time: due ones first, then the day's new ones. Answer from memory,
 * open the note if needed, then grade yourself; grades feed the same schedule as problems.
 */
export function QuestionRunner(): JSX.Element {
  const { cardReviews } = useLearningState()
  const dispatch = useLearningDispatch()
  const showToast = useToast()
  const queue = quizQueue(repositorySnapshot, cardReviews, new Date())
  const current = queue.due[0]?.card ?? queue.fresh[0]
  const isNew = queue.due.length === 0
  const [revealed, setRevealed] = useState<string | null>(null)
  const showNote = current !== undefined && revealed === current.id
  const note = useNoteContent(current?.note.topicSlug ?? '', current?.note.slug ?? '', showNote)
  const heading = useRef<HTMLHeadingElement>(null)
  const graded = useRef(false)

  // After the last card the grade buttons disappear; keep keyboard focus in this section.
  useEffect(() => {
    if (graded.current && current === undefined) {
      heading.current?.focus()
    }

    graded.current = false
  }, [current])

  function grade(outcome: SolveOutcome): void {
    if (current === undefined) {
      return
    }

    const review = { cardId: current.id, reviewedAt: new Date().toISOString(), outcome }

    graded.current = true
    dispatch({ type: 'cardReviewed', review })
    setRevealed(null)
    showToast({
      message: outcome === 'success' ? 'Marked “Got it”' : 'Marked “Shaky”: back tomorrow',
      action: {
        label: 'Undo',
        onAction: () => dispatch({ type: 'cardReviewUndone', cardId: review.cardId, reviewedAt: review.reviewedAt }),
      },
    })
  }

  return (
    <section className="card question-runner" aria-labelledby="questions-heading">
      <div className="card-header">
        <div>
          <h2 id="questions-heading" ref={heading} tabIndex={-1}>
            Note questions
          </h2>
          <p className="card-subtitle">
            {plural(queue.due.length, 'question')} due · {queue.fresh.length} new today
          </p>
        </div>
      </div>

      {current === undefined ? (
        <EmptyState title="All caught up" compact>
          {queue.unseen > 0 ? 'New questions unlock tomorrow.' : 'Every question is scheduled; due ones come back here.'}
        </EmptyState>
      ) : (
        <div className="quiz">
          <p className="quiz-meta">
            <span className="badge" data-status={isNew ? undefined : 'due'}>
              {isNew ? 'New' : 'Due'}
            </span>
            <span>{topicTitle(current.note.topicSlug)}</span>
            <Link to={notePath(current.note)}>{cleanTitle(current.note.title)}</Link>
          </p>
          <p className="quiz-question" id="quiz-question">
            {current.question}
          </p>

          <div className="button-row">
            <button
              type="button"
              className="button button-quiet button-small"
              aria-expanded={showNote}
              aria-controls="quiz-note"
              onClick={() => setRevealed(showNote ? null : current.id)}
            >
              <Icon name="book" size={14} />
              {showNote ? 'Hide note' : 'Show note'}
            </button>
          </div>

          <div
            id="quiz-note"
            className="quiz-note"
            hidden={!showNote}
            tabIndex={showNote ? 0 : undefined}
            role="group"
            aria-label={`Note: ${cleanTitle(current.note.title)}`}
          >
            {note?.status === 'ready' && <NoteContent html={note.content.html} />}
            {note?.status === 'loading' && <p className="empty-line">Loading note…</p>}
            {(note?.status === 'missing' || note?.status === 'error') && (
              <p className="empty-line">
                This note is not available here. <Link to={notePath(current.note)}>Open the note page</Link>.
              </p>
            )}
          </div>

          <div className="button-row" role="group" aria-label="How well did you answer?">
            <button type="button" className="button button-primary" onClick={() => grade('success')}>
              <Icon name="check" />
              Got it
            </button>
            <button type="button" className="button button-secondary" onClick={() => grade('needs-review')}>
              <Icon name="rotate" />
              Shaky
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
