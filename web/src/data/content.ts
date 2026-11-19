/**
 * Loaders for heavy content that `generate:data` writes to `public/content/` (gitignored). Vite
 * copies it into the build as static files, fetched one at a time from the same origin, so the
 * main bundle does not grow with content. Before the first `generate:data` run nothing is there
 * and loaders resolve to `undefined`.
 */

export interface SolutionFileContent {
  readonly language: string
  /** Path inside the problem folder, usually just the file name. */
  readonly file: string
  readonly lines: number
  /** Shiki HTML: a `<pre>` whose tokens carry `--shiki-light` and `--shiki-dark` colors. */
  readonly html: string
}

export interface SolutionContent {
  readonly problemId: number
  readonly files: readonly SolutionFileContent[]
}

export interface NoteHeading {
  readonly id: string
  readonly text: string
  readonly depth: number
}

export interface NoteContent {
  readonly path: string
  /** markdown-it HTML with GitHub heading ids; note links point at `#/notes/<topic>/<slug>?section=<id>`. */
  readonly html: string
  /** The note's h2 and h3 headings, in order. */
  readonly toc: readonly NoteHeading[]
}

const CONTENT_URL = `${import.meta.env.BASE_URL}content/`

/**
 * Fetches one generated JSON file. Resolves to `undefined` when it does not exist; dev servers
 * answer unknown paths with the HTML app shell, so anything but JSON counts as missing.
 * Rejects when the request itself fails.
 */
async function fetchContent<T>(relativePath: string): Promise<T | undefined> {
  const response = await fetch(`${CONTENT_URL}${relativePath}`)

  if (!response.ok || !(response.headers.get('content-type') ?? '').includes('json')) {
    return undefined
  }

  return (await response.json()) as T
}

/** The highlighted solutions of one problem. */
export function loadSolutions(problemId: number): Promise<SolutionContent | undefined> {
  return fetchContent<SolutionContent>(`solutions/${problemId}.json`)
}

export interface NoteHeadings {
  readonly topicSlug: string
  readonly slug: string
  readonly headings: readonly { readonly id: string; readonly text: string }[]
}

/** Every note's h2 and h3 headings, for searching sections. */
export function loadNoteHeadings(): Promise<readonly NoteHeadings[] | undefined> {
  return fetchContent<readonly NoteHeadings[]>('notes/index.json')
}

/** One rendered note. */
export function loadNote(topicSlug: string, slug: string): Promise<NoteContent | undefined> {
  return fetchContent<NoteContent>(`notes/${encodeURIComponent(topicSlug)}/${encodeURIComponent(slug)}.json`)
}
