import { useEffect, useState, type JSX } from 'react'

import { loadNote, type NoteContent as NoteContentData } from '../data/content'

export type NoteLoad =
  | { readonly status: 'loading' | 'missing' | 'error' }
  | { readonly status: 'ready'; readonly content: NoteContentData }

/**
 * Loads one rendered note. While `enabled` is false nothing is fetched and the hook returns
 * `undefined`; a result for an earlier note is never shown for the current one.
 */
export function useNoteContent(topicSlug: string, slug: string, enabled = true): NoteLoad | undefined {
  const key = `${topicSlug}/${slug}`
  const [result, setResult] = useState<{ readonly key: string; readonly load: NoteLoad } | undefined>(undefined)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    let active = true

    loadNote(topicSlug, slug).then(
      (content) => {
        if (active) {
          setResult({ key, load: content === undefined ? { status: 'missing' } : { status: 'ready', content } })
        }
      },
      () => {
        if (active) {
          setResult({ key, load: { status: 'error' } })
        }
      },
    )

    return () => {
      active = false
    }
  }, [enabled, key, topicSlug, slug])

  if (!enabled) {
    return undefined
  }

  return result?.key === key ? result.load : { status: 'loading' }
}

/**
 * A rendered note. The HTML is trusted: it is produced at build time from this repository's
 * Markdown by scripts/content/notes.mjs, with raw HTML disabled.
 */
export function NoteContent({ html }: { readonly html: string }): JSX.Element {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}

/** Moves to a heading inside rendered note content: scrolls it into view and focuses it. */
export function focusSection(id: string): void {
  const heading = document.getElementById(id)

  heading?.scrollIntoView?.({ block: 'start' })
  heading?.focus({ preventScroll: true })
}
