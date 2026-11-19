import type { NoteSummary, RepositorySnapshot } from '../data/types'
import { cleanTitle } from '../lib/format'

export type SearchKind = 'page' | 'action' | 'topic' | 'note' | 'section' | 'problem'

export interface SearchItem {
  readonly id: string
  readonly kind: SearchKind
  readonly title: string
  /** Context shown after the title, such as the note a section belongs to. */
  readonly subtitle?: string
  /** Route to open; actions use `run` instead. */
  readonly to?: string
  readonly run?: () => void
  readonly problemId?: number
  readonly languages?: readonly string[]
}

export interface NoteHeadingIndex {
  readonly topicSlug: string
  readonly slug: string
  readonly headings: readonly { readonly id: string; readonly text: string }[]
}

export const MAX_RESULTS = 50

/** Ties in score resolve in this order. */
const KIND_ORDER: readonly SearchKind[] = ['page', 'action', 'topic', 'note', 'section', 'problem']

export const PAGE_ITEMS: readonly SearchItem[] = [
  { id: 'page:today', kind: 'page', title: 'Today', to: '/' },
  { id: 'page:review', kind: 'page', title: 'Review', to: '/review' },
  { id: 'page:map', kind: 'page', title: 'Knowledge Map', to: '/map' },
  { id: 'page:leetcode', kind: 'page', title: 'LeetCode', to: '/leetcode' },
]

function noteRoute(note: Pick<NoteSummary, 'topicSlug' | 'slug'>): string {
  return `/notes/${note.topicSlug}/${note.slug}`
}

/** Topics, notes, and problems from the snapshot; built once at module load by the palette. */
export function snapshotItems(snapshot: Pick<RepositorySnapshot, 'topics' | 'notes' | 'problems'>): SearchItem[] {
  const topicTitles = new Map(snapshot.topics.map((topic) => [topic.slug, topic.title]))

  return [
    ...snapshot.topics.map((topic) => ({
      id: `topic:${topic.slug}`,
      kind: 'topic' as const,
      title: topic.title,
      subtitle: topic.focus,
      to: `/map?topic=${encodeURIComponent(topic.slug)}`,
    })),
    ...snapshot.notes.map((note) => ({
      id: `note:${note.path}`,
      kind: 'note' as const,
      title: cleanTitle(note.title),
      subtitle: topicTitles.get(note.topicSlug) ?? note.topicSlug,
      to: noteRoute(note),
    })),
    ...snapshot.problems.map((problem) => ({
      id: `problem:${problem.id}`,
      kind: 'problem' as const,
      title: problem.title,
      subtitle: `#${problem.id}`,
      to: `/leetcode?problem=${problem.id}`,
      problemId: problem.id,
      languages: problem.languages,
    })),
  ]
}

/** One item per note heading, from the lazily loaded heading index. */
export function sectionItems(
  index: readonly NoteHeadingIndex[],
  notes: readonly Pick<NoteSummary, 'topicSlug' | 'slug' | 'title'>[],
): SearchItem[] {
  const titles = new Map(notes.map((note) => [`${note.topicSlug}/${note.slug}`, cleanTitle(note.title)]))

  return index.flatMap((entry) => {
    const noteTitle = titles.get(`${entry.topicSlug}/${entry.slug}`)

    return noteTitle === undefined
      ? []
      : entry.headings.map((heading) => ({
          id: `section:${entry.topicSlug}/${entry.slug}#${heading.id}`,
          kind: 'section' as const,
          title: heading.text,
          subtitle: noteTitle,
          to: `${noteRoute(entry)}?section=${encodeURIComponent(heading.id)}`,
        }))
  })
}

function isWordChar(character: string | undefined): boolean {
  return character !== undefined && /[\p{L}\p{N}]/u.test(character)
}

/**
 * Scores one query token against a text, or `undefined` when it does not match.
 * A substring beats a scattered subsequence; matches at the start of the text or of a word,
 * and consecutive characters, score higher. Longer texts score slightly lower.
 */
export function scoreToken(token: string, text: string): number | undefined {
  const query = token.toLowerCase()
  const haystack = text.toLowerCase()
  const position = haystack.indexOf(query)

  if (position !== -1) {
    const wordStart = position === 0 || !isWordChar(haystack[position - 1])

    return 100 + (position === 0 ? 30 : 0) + (wordStart ? 20 : 0) - position * 0.1 - haystack.length * 0.02
  }

  let score = 0
  let from = 0
  let previous = -2

  for (const character of query) {
    const index = haystack.indexOf(character, from)

    if (index === -1) {
      return undefined
    }

    score += 1 + (index === previous + 1 ? 4 : 0) + (index === 0 || !isWordChar(haystack[index - 1]) ? 6 : 0)
    previous = index
    from = index + 1
  }

  return score - haystack.length * 0.02
}

/** Every whitespace-separated token must match; the item's score is their sum. */
function scoreItem(tokens: readonly string[], item: SearchItem): number | undefined {
  let total = 0

  for (const token of tokens) {
    const score = scoreToken(token, item.title)

    if (score === undefined) {
      return undefined
    }

    total += score
  }

  return total
}

/**
 * Ranks items for a query. An empty query lists pages and actions. A number (`42`, `#42`) finds
 * problems by number prefix, exact number first. Otherwise items rank by fuzzy score, then kind,
 * then title.
 */
export function search(items: readonly SearchItem[], query: string, limit = MAX_RESULTS): SearchItem[] {
  const trimmed = query.trim()

  if (trimmed === '') {
    return items.filter((item) => item.kind === 'page' || item.kind === 'action')
  }

  const number = /^#?(\d+)$/.exec(trimmed)?.[1]

  if (number !== undefined) {
    return items
      .filter((item) => item.problemId !== undefined && String(item.problemId).startsWith(number))
      .sort((left, right) => (left.problemId ?? 0) - (right.problemId ?? 0))
      .slice(0, limit)
  }

  const tokens = trimmed.split(/\s+/)

  return items
    .flatMap((item) => {
      const score = scoreItem(tokens, item)
      return score === undefined ? [] : [{ item, score }]
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        KIND_ORDER.indexOf(left.item.kind) - KIND_ORDER.indexOf(right.item.kind) ||
        left.item.title.localeCompare(right.item.title),
    )
    .slice(0, limit)
    .map((entry) => entry.item)
}
