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

const CONTENT_URL = `${import.meta.env.BASE_URL}content/`

/**
 * The highlighted solutions of one problem. Resolves to `undefined` when the file does not exist;
 * dev servers answer unknown paths with the HTML app shell, so anything but JSON counts as missing.
 * Rejects when the request itself fails.
 */
export async function loadSolutions(problemId: number): Promise<SolutionContent | undefined> {
  const response = await fetch(`${CONTENT_URL}solutions/${problemId}.json`)

  if (!response.ok || !(response.headers.get('content-type') ?? '').includes('json')) {
    return undefined
  }

  return (await response.json()) as SolutionContent
}
