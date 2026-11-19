import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectRepositorySnapshot,
  loadLanguageNames,
  renderRepositoryModule,
} from './repository-data.mjs'

const validFixtureRoot = new URL('./fixtures/valid', import.meta.url)
const duplicateFixtureRoot = new URL('./fixtures/duplicate', import.meta.url)
const nestedFixtureRoot = new URL('./fixtures/nested', import.meta.url)

test('collects topics, notes, solved problems, and languages', () => {
  const snapshot = collectRepositorySnapshot(validFixtureRoot)

  assert.equal(snapshot.topics.length, 1)
  assert.equal(snapshot.topics[0]?.slug, 'clickhouse')
  assert.equal(snapshot.topics[0]?.title, 'ClickHouse')
  assert.equal(snapshot.topics[0]?.noteCount, 1)
  assert.equal(snapshot.topics[0]?.lastNote, '2026-11-17')

  assert.equal(snapshot.notes.length, 1)
  assert.equal(snapshot.notes[0]?.topicSlug, 'clickhouse')
  assert.equal(snapshot.notes[0]?.title, 'Date and time functions')
  assert.equal(snapshot.notes[0]?.filename, 'date-time-functions.md')

  assert.equal(snapshot.problems.length, 1)
  assert.equal(snapshot.problems[0]?.id, 1)
  assert.equal(snapshot.problems[0]?.title, 'Two Sum')
  assert.equal(snapshot.problems[0]?.difficulty, 'easy')
  assert.deepEqual(snapshot.problems[0]?.tags, ['Array', 'Hash Table'])
  assert.deepEqual(snapshot.problems[0]?.languages, ['Go', 'TypeScript'])
  assert.deepEqual(snapshot.problems[0]?.solutions, [
    { language: 'Go', file: 'leetcode/easy/0001. Two Sum/main.go' },
    { language: 'TypeScript', file: 'leetcode/easy/0001. Two Sum/main.ts' },
  ])

  assert.equal(snapshot.counts.topics, 1)
  assert.equal(snapshot.counts.notes, 1)
  assert.equal(snapshot.counts.solvedProblems, 1)
  assert.deepEqual(snapshot.counts.languages, ['Go', 'TypeScript'])
})

test('rejects duplicate solved problem ids', () => {
  assert.throws(
    () => collectRepositorySnapshot(duplicateFixtureRoot),
    /duplicate solved problem id 1/i
  )
})

test('rejects a problem folder nested inside another problem', () => {
  assert.throws(
    () => collectRepositorySnapshot(nestedFixtureRoot),
    /nested problem folder inside another problem: leetcode\/easy\/0001\. Two Sum\/0009\. Palindrome Number/i
  )
})

test('renders a browser-safe typed repository module', () => {
  const snapshot = collectRepositorySnapshot(validFixtureRoot)
  const moduleText = renderRepositoryModule(snapshot)

  assert.match(moduleText, /export const repositorySnapshot/)
  assert.match(moduleText, /satisfies RepositorySnapshot/)
  assert.match(moduleText, /"slug": "clickhouse"/)
  assert.match(moduleText, /"languages": \[\n\s+"Go",\n\s+"TypeScript"\n\s+\]/)
  assert.doesNotMatch(moduleText, /from ['"]node:/)
})

test('maps every registry extension to exactly one language', () => {
  const names = loadLanguageNames()

  assert.equal(names['.go'], 'Go')
  assert.equal(names['.ex'], 'Elixir')
  assert.equal(names['.exs'], 'Elixir')
  assert.throws(
    () => loadLanguageNames(new URL('./fixtures/languages-duplicate.json', import.meta.url)),
    /extension \.go is listed for both go and golang/i
  )
})
