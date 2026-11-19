import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { generateNoteContent } from './content/notes.mjs'
import { generateSolutionContent } from './content/solutions.mjs'
import {
  collectRepositorySnapshot,
  loadShikiLanguages,
  renderRepositoryModule,
} from './repository-data.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const repositoryRoot = path.resolve(path.dirname(scriptPath), '..', '..')
const outputPath = path.resolve(
  path.dirname(scriptPath),
  '..',
  'src',
  'data',
  'generated',
  'repository.ts'
)

const snapshot = collectRepositorySnapshot(repositoryRoot)
const moduleText = renderRepositoryModule(snapshot)

mkdirSync(path.dirname(outputPath), { recursive: true })
writeFileSync(outputPath, moduleText)

// Heavy, gitignored content that the app fetches on demand: highlighted solutions.
const webRoot = path.resolve(path.dirname(scriptPath), '..')
const started = performance.now()
const solutions = await generateSolutionContent({
  repoRoot: repositoryRoot,
  problems: snapshot.problems,
  outDir: path.join(webRoot, 'public', 'content', 'solutions'),
  manifestPath: path.join(webRoot, 'node_modules', '.cache', 'compscie', 'solutions-manifest.json'),
  shikiLanguages: loadShikiLanguages(),
})
const seconds = ((performance.now() - started) / 1000).toFixed(1)

console.log(
  `Solutions: ${solutions.written} highlighted, ${solutions.skipped} unchanged, ${solutions.removed} removed (${seconds}s)`
)

const notes = await generateNoteContent({
  repoRoot: repositoryRoot,
  notes: snapshot.notes,
  outDir: path.join(webRoot, 'public', 'content', 'notes'),
})

console.log(`Notes: ${notes.written} rendered`)
