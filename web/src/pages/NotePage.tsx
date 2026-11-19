import { useEffect, type JSX } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'

import { NoteContent, focusSection, useNoteContent } from '../components/NoteContent'
import { usePageTitle } from '../components/RouteEffects'
import { ExternalLink, PageHeader } from '../components/ui'
import { repositoryFileUrl } from '../data/links'
import { allNotes, findNote, notePath } from '../data/notes'
import { findTopic } from '../data/topics'
import type { NoteSummary } from '../data/types'
import { cleanTitle, formatDay } from '../lib/format'
import { NotFoundPage } from './NotFoundPage'

/** The table of contents starts open beside the note on wide screens, collapsed above it on phones. */
function wideScreen(): boolean {
  return typeof window.matchMedia !== 'function' || window.matchMedia('(min-width: 64rem)').matches
}

export function NotePage(): JSX.Element {
  const { topic = '', slug = '' } = useParams()
  const note = findNote(topic, slug)

  return note === undefined ? <NotFoundPage /> : <NoteView key={note.path} note={note} />
}

function NoteView({ note }: { readonly note: NoteSummary }): JSX.Element {
  const title = cleanTitle(note.title)
  usePageTitle(title)
  const topic = findTopic(note.topicSlug)
  const load = useNoteContent(note.topicSlug, note.slug)
  const [params] = useSearchParams()
  const section = params.get('section')
  const siblings = allNotes.filter((item) => item.topicSlug === note.topicSlug)
  const index = siblings.findIndex((item) => item.path === note.path)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  const ready = load?.status === 'ready'

  // Runs after the content arrives, so it wins over the route's focus on the page title.
  useEffect(() => {
    if (ready && section !== null) {
      focusSection(section)
    }
  }, [ready, section])

  return (
    <div className="page note-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/map">Knowledge Map</Link>
          </li>
          <li>{topic?.title ?? note.topicSlug}</li>
        </ol>
      </nav>

      <PageHeader
        title={title}
        titleId="note-heading"
        description={
          <span className="note-meta">
            {note.date !== '' && <span>{formatDay(note.date)}</span>}
            {note.concepts.map((concept) => (
              <span key={concept} className="tag">
                {concept}
              </span>
            ))}
          </span>
        }
      />

      <div className="note-layout">
        {load?.status === 'ready' && load.content.toc.length > 0 && (
          <details className="note-toc" open={wideScreen()}>
            <summary className="note-toc-title">On this page</summary>
            <nav aria-label="On this page">
              <ol>
              {load.content.toc.map((heading) => (
                <li key={heading.id} data-depth={heading.depth}>
                  <Link
                    to={`?section=${encodeURIComponent(heading.id)}`}
                    onClick={() => {
                      // Same section again: the URL does not change, so move there directly.
                      if (heading.id === section) {
                        focusSection(heading.id)
                      }
                    }}
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
              </ol>
            </nav>
          </details>
        )}

        <article className="card note-article" aria-labelledby="note-heading">
          {load?.status === 'ready' && <NoteContent html={load.content.html} />}
          {load?.status === 'loading' && (
            <p className="empty-line" aria-busy="true">
              Loading note…
            </p>
          )}
          {(load?.status === 'missing' || load?.status === 'error') && (
            <p className="empty-line">
              {load.status === 'missing' ? (
                <>
                  Note not built yet. Run <code>yarn --cwd web run generate:data</code>.
                </>
              ) : (
                'Could not load this note.'
              )}{' '}
              <ExternalLink className="text-link" href={repositoryFileUrl(note.path)}>
                Read it on GitHub
              </ExternalLink>
            </p>
          )}
        </article>
      </div>

      <div className="note-footer">
        {(previous !== undefined || next !== undefined) && (
          <nav className="note-pager" aria-label={`More ${topic?.title ?? note.topicSlug} notes`}>
            {previous !== undefined && (
              <Link to={notePath(previous)} rel="prev">
                <span className="note-pager-label">Previous</span>
                {cleanTitle(previous.title)}
              </Link>
            )}
            {next !== undefined && (
              <Link to={notePath(next)} rel="next" className="note-pager-next">
                <span className="note-pager-label">Next</span>
                {cleanTitle(next.title)}
              </Link>
            )}
          </nav>
        )}
        <ExternalLink className="text-link" href={repositoryFileUrl(note.path)}>
          View on GitHub
        </ExternalLink>
      </div>
    </div>
  )
}
