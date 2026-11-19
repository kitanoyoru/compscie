// Writes one JSON file per solved problem with every solution file highlighted:
//
//   public/content/solutions/<id>.json
//     { problemId, files: [{ language, file, lines, html }] }
//
// Vite copies public/ into the build as plain static files, and the app fetches one when a
// solution is opened, so the main bundle carries no per-problem chunk map. The folder is
// gitignored and rebuilt by `generate:data`. A manifest (kept outside public/, so it is not
// deployed) stores the source hash of each problem: only changed problems are highlighted again,
// and any change to the content scripts or the highlight settings rebuilds everything.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CODE_BACKGROUNDS, CODE_THEMES, MIN_TEXT_CONTRAST, createCodeHighlighter } from './highlighter.mjs'

const SCRIPT_FILES = ['./solutions.mjs', './highlighter.mjs', '../lib/color.mjs'].map(
  (relative) => new URL(relative, import.meta.url)
)

function sha1(...parts) {
  const hash = createHash('sha1')

  for (const part of parts) {
    hash.update(part)
    hash.update('\0')
  }

  return hash.digest('hex')
}

/** Changes whenever the scripts or highlight settings change, which invalidates every file. */
function settingsKey() {
  return sha1(
    JSON.stringify({ CODE_THEMES, CODE_BACKGROUNDS, MIN_TEXT_CONTRAST }),
    ...SCRIPT_FILES.map((file) => readFileSync(file, 'utf8'))
  )
}

function readManifest(manifestPath) {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    return { key: '', problems: {} }
  }
}

function lineCount(code) {
  return code === '' ? 0 : code.split('\n').length
}

/**
 * @param {object} options
 * @param {string | URL} options.repoRoot
 * @param {readonly { id: number, path: string, solutions: readonly { language: string, file: string }[] }[]} options.problems
 * @param {string | URL} options.outDir
 * @param {string | URL} options.manifestPath where source hashes are kept between runs
 * @param {Record<string, string>} options.shikiLanguages display name → Shiki language id
 */
export async function generateSolutionContent({ repoRoot, problems, outDir, manifestPath, shikiLanguages }) {
  const toPath = (value) => (value instanceof URL ? fileURLToPath(value) : value)
  const root = toPath(repoRoot)
  const out = toPath(outDir)
  const manifestFile = toPath(manifestPath)
  const key = settingsKey()
  const previous = readManifest(manifestFile)
  const known = previous.key === key ? previous.problems : {}
  const manifest = { key, problems: {} }
  const stats = { written: 0, skipped: 0, removed: 0 }
  let highlighter

  mkdirSync(out, { recursive: true })

  try {
    for (const problem of problems) {
      const sources = problem.solutions.map((solution) => ({
        ...solution,
        code: readFileSync(path.join(root, problem.path, solution.file), 'utf8').replace(/\s+$/, ''),
      }))
      const hash = sha1(...sources.flatMap((source) => [source.language, source.file, source.code]))
      const target = path.join(out, `${problem.id}.json`)

      manifest.problems[problem.id] = hash

      if (known[problem.id] === hash && existsSync(target)) {
        stats.skipped += 1
        continue
      }

      highlighter ??= await createCodeHighlighter([...new Set(Object.values(shikiLanguages))])

      const files = sources.map((source) => ({
        language: source.language,
        file: source.file,
        lines: lineCount(source.code),
        html: highlighter.highlight(source.code, shikiLanguages[source.language] ?? 'text'),
      }))

      writeFileSync(target, JSON.stringify({ problemId: problem.id, files }))
      stats.written += 1
    }
  } finally {
    highlighter?.dispose()
  }

  for (const entry of readdirSync(out)) {
    const id = /^(\d+)\.json$/.exec(entry)?.[1]

    if (id !== undefined && manifest.problems[id] === undefined) {
      rmSync(path.join(out, entry))
      stats.removed += 1
    }
  }

  mkdirSync(path.dirname(manifestFile), { recursive: true })
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)

  return stats
}
