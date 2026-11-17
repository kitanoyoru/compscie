import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import {
  collectRepositorySnapshot,
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
