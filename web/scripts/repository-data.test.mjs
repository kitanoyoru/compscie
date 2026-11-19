import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectRepositorySnapshot,
  extractQuestions,
  loadLanguageNames,
  renderRepositoryModule,
} from './repository-data.mjs'

const validFixtureRoot = new URL('./fixtures/valid', import.meta.url)
const duplicateFixtureRoot = new URL('./fixtures/duplicate', import.meta.url)
const nestedFixtureRoot = new URL('./fixtures/nested', import.meta.url)
const unknownConceptFixtureRoot = new URL('./fixtures/unknown-concept', import.meta.url)
const unusedConceptFixtureRoot = new URL('./fixtures/unused-concept', import.meta.url)

test('collects topics, notes, solved problems, and languages', () => {
  const snapshot = collectRepositorySnapshot(validFixtureRoot)

  assert.equal(snapshot.topics.length, 1)
  assert.equal(snapshot.topics[0]?.slug, 'clickhouse')
  assert.equal(snapshot.topics[0]?.title, 'ClickHouse')
  assert.equal(snapshot.topics[0]?.noteCount, 1)
  assert.equal(snapshot.topics[0]?.lastNote, '2026-11-17')
  assert.deepEqual(snapshot.topics[0]?.concepts, ['Date/time queries', 'MergeTree storage'])

  assert.equal(snapshot.notes.length, 1)
  assert.equal(snapshot.notes[0]?.topicSlug, 'clickhouse')
  assert.equal(snapshot.notes[0]?.title, 'Date and time functions')
  assert.equal(snapshot.notes[0]?.filename, 'date-time-functions.md')
  assert.deepEqual(snapshot.notes[0]?.concepts, ['Date/time queries', 'MergeTree storage'])
  assert.equal(snapshot.notes[0]?.slug, 'date-time-functions')

  assert.equal(snapshot.problems.length, 1)
  assert.equal(snapshot.problems[0]?.id, 1)
  assert.equal(snapshot.problems[0]?.title, 'Two Sum')
  assert.equal(snapshot.problems[0]?.difficulty, 'easy')
  assert.deepEqual(snapshot.problems[0]?.tags, ['Array', 'Hash Table'])
  assert.deepEqual(snapshot.problems[0]?.languages, ['Go', 'TypeScript'])
  assert.deepEqual(snapshot.problems[0]?.solutions, [
    { language: 'Go', file: 'main.go' },
    { language: 'TypeScript', file: 'main.ts' },
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

test('rejects a note concept its topic README does not define', () => {
  assert.throws(
    () => collectRepositorySnapshot(unknownConceptFixtureRoot),
    /notes\/clickhouse\/date-time-functions\.md lists concept "Joins", which notes\/clickhouse\/README\.md does not define/
  )
})

test('rejects a topic concept that no note covers', () => {
  assert.throws(
    () => collectRepositorySnapshot(unusedConceptFixtureRoot),
    /Concept "Joins" in notes\/clickhouse\/README\.md has no notes/
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

test('extracts plain-text questions from the "Questions this answers" section', () => {
  const content = [
    '# Title',
    '',
    '## Questions this answers',
    '',
    '- What does `toStartOfDay()` return?',
    '- Why is **this** a [link](other.md) and *that* not?',
    '- What about snake_case_names?',
    '',
    '## Notes',
    '',
    '- Not a question.',
  ].join('\n')

  assert.deepEqual(extractQuestions(content), [
    'What does toStartOfDay() return?',
    'Why is this a link and that not?',
    'What about snake_case_names?',
  ])
  assert.deepEqual(extractQuestions('# No questions here'), [])
})
