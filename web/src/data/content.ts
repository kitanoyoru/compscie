/**
 * Lazy loaders for heavy content that `generate:data` writes to `generated/content/` (gitignored).
 * Each file becomes its own chunk, so the main bundle does not grow with content. Before the
 * first `generate:data` run the folder is empty and every loader resolves to `undefined`.
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

const solutionModules = import.meta.glob<SolutionContent>('./generated/content/solutions/*.json', {
  import: 'default',
})

export async function loadSolutions(problemId: number): Promise<SolutionContent | undefined> {
  const load = solutionModules[`./generated/content/solutions/${problemId}.json`]

  return load === undefined ? undefined : load()
}
