import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const TOPIC_STATUSES = new Set(['active', 'planned', 'paused', 'done'])
const DIFFICULTIES = new Set(['easy', 'medium', 'hard'])

const LANGUAGE_REGISTRY_URL = new URL('../../tools/languages.json', import.meta.url)

/** File extension (lowercase, with the dot) to display name, from tools/languages.json. */
export function loadLanguageNames(registryUrl = LANGUAGE_REGISTRY_URL) {
  const { languages } = JSON.parse(readFileSync(registryUrl, 'utf8'))
  const names = {}

  for (const language of languages) {
    for (const extension of language.extensions) {
      if (Object.hasOwn(names, extension)) {
        throw new Error(
          `Extension ${extension} is listed for both ${names[extension]} and ${language.name}`
        )
      }

      names[extension] = language.name
    }
  }

  return names
}

const LANGUAGE_NAMES = loadLanguageNames()

function repositoryPath(value) {
  return value instanceof URL ? fileURLToPath(value) : value
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

function relativePath(repoRoot, target) {
  return toPosix(path.relative(repositoryPath(repoRoot), target))
}

function parseFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)

  if (!match) {
    return {}
  }

  return match[1]
    .split(/\r?\n/)
    .map((line) => /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line))
    .filter(Boolean)
    .reduce((frontmatter, match) => {
      frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '')
      return frontmatter
    }, {})
}

function noteTitle(content, filename) {
  const heading = /^#\s+(.+)$/m.exec(content)

  if (heading?.[1]) {
    return heading[1].trim()
  }

  return filename.replace(/\.md$/, '').replace(/-/g, ' ')
}

function collectNotes(repoRoot, topicSlug) {
  const topicRoot = path.join(repositoryPath(repoRoot), 'notes', topicSlug)

  return readdirSync(topicRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        entry.name !== 'README.md' &&
        !entry.name.startsWith('.')
    )
    .map((entry) => {
      const notePath = path.join(topicRoot, entry.name)
      const content = readFileSync(notePath, 'utf8')
      const frontmatter = parseFrontmatter(content)

      return {
        topicSlug,
        title: noteTitle(content, entry.name),
        filename: entry.name,
        path: relativePath(repoRoot, notePath),
        date: frontmatter.date ?? '',
      }
    })
    .sort((left, right) => {
      if (left.date !== right.date) {
        return left.date < right.date ? 1 : -1
      }

      return left.filename.localeCompare(right.filename)
    })
}

function topicStatus(value) {
  if (!TOPIC_STATUSES.has(value)) {
    throw new Error(`Topic has an invalid status: ${value}`)
  }

  return value
}

function collectTopics(repoRoot, notes) {
  const notesRoot = path.join(repositoryPath(repoRoot), 'notes')

  return readdirSync(notesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .filter((entry) => entry.name !== '_template')
    .map((entry) => {
      const readmePath = path.join(notesRoot, entry.name, 'README.md')

      if (!existsSync(readmePath)) {
        throw new Error(`Missing topic README: notes/${entry.name}/README.md`)
      }

      const frontmatter = parseFrontmatter(readFileSync(readmePath, 'utf8'))

      if (!frontmatter.title || !frontmatter.status || !frontmatter.started) {
        throw new Error(
          `Topic README is missing required frontmatter: notes/${entry.name}/README.md`
        )
      }

      const topicNotes = notes.filter((note) => note.topicSlug === entry.name)

      return {
        slug: entry.name,
        title: frontmatter.title,
        status: topicStatus(frontmatter.status),
        focus: frontmatter.focus ?? '',
        next: frontmatter.next ?? '',
        started: frontmatter.started,
        lastNote: topicNotes[0]?.date ?? null,
        noteCount: topicNotes.length,
      }
    })
    .sort((left, right) => left.slug.localeCompare(right.slug))
}

function loadProblemIndex(repoRoot) {
  const indexPath = path.join(repositoryPath(repoRoot), 'tools', 'leetcode-index.tsv')
  const lines = readFileSync(indexPath, 'utf8').trimEnd().split(/\r?\n/)
  const header = lines[0]?.split('\t')

  if (
    !header ||
    header.length < 3 ||
    header[0] !== 'id' ||
    header[1] !== 'difficulty' ||
    header[2] !== 'title'
  ) {
    throw new Error('Invalid LeetCode index header')
  }

  const problems = new Map()

  for (const line of lines.slice(1)) {
    const [rawId, rawDifficulty, title, rawTags = ''] = line.split('\t')
    const id = Number(rawId)
    const difficulty = rawDifficulty.toLowerCase()

    if (!Number.isInteger(id) || id < 1) {
      throw new Error(`Invalid LeetCode problem id: ${rawId}`)
    }

    if (!DIFFICULTIES.has(difficulty)) {
      throw new Error(`Invalid LeetCode difficulty for problem ${id}: ${rawDifficulty}`)
    }

    if (!title) {
      throw new Error(`LeetCode problem ${id} is missing a title`)
    }

    if (problems.has(id)) {
      throw new Error(`Duplicate LeetCode index entry for problem ${id}`)
    }

    problems.set(id, {
      id,
      title,
      difficulty,
      tags: rawTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
  }

  return problems
}

function collectLanguages(problemRoot) {
  const languages = new Set()

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) {
        continue
      }

      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        visit(entryPath)
        continue
      }

      if (!entry.isFile()) {
        continue
      }

      const language = LANGUAGE_NAMES[path.extname(entry.name).toLowerCase()]
      if (language) {
        languages.add(language)
      }
    }
  }

  visit(problemRoot)
  return [...languages].sort((left, right) => left.localeCompare(right))
}

function problemIdFromFolder(name) {
  const match = /^\s*(\d{1,4})\b/.exec(name)
  const id = match ? Number(match[1]) : null

  if (!id) {
    throw new Error(`LeetCode problem folder has no numeric id: ${name}`)
  }

  return id
}

function collectProblems(repoRoot) {
  const index = loadProblemIndex(repoRoot)
  const problems = []
  const seen = new Map()
  const leetcodeRoot = path.join(repositoryPath(repoRoot), 'leetcode')

  for (const difficulty of ['easy', 'medium', 'hard']) {
    const difficultyRoot = path.join(leetcodeRoot, difficulty)

    if (!existsSync(difficultyRoot)) {
      continue
    }

    for (const entry of readdirSync(difficultyRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) {
        continue
      }

      const id = problemIdFromFolder(entry.name)
      const metadata = index.get(id)

      if (!metadata) {
        throw new Error(`LeetCode problem ${id} is missing from the index`)
      }

      if (seen.has(id)) {
        throw new Error(`Duplicate solved problem id ${id}: ${seen.get(id)} and ${entry.name}`)
      }

      const problemRoot = path.join(difficultyRoot, entry.name)
      const languages = collectLanguages(problemRoot)

      if (languages.length === 0) {
        throw new Error(`LeetCode problem ${id} has no recognized solution files`)
      }

      seen.set(id, entry.name)
      problems.push({
        ...metadata,
        languages,
        path: relativePath(repoRoot, problemRoot),
      })
    }
  }

  return problems.sort((left, right) => left.id - right.id)
}

function snapshotDate(notes, topics) {
  const dates = [
    ...notes.map((note) => note.date),
    ...topics.map((topic) => topic.started),
  ].filter(Boolean).sort()
  const latest = dates.at(-1)

  return latest ? `${latest}T00:00:00.000Z` : '1970-01-01T00:00:00.000Z'
}

export function collectRepositorySnapshot(repoRoot) {
  const root = repositoryPath(repoRoot)
  const topicSlugs = readdirSync(path.join(root, 'notes'), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        entry.name !== '_template'
    )
    .map((entry) => entry.name)
  const notes = topicSlugs
    .flatMap((slug) => collectNotes(root, slug))
    .sort((left, right) => {
      if (left.date !== right.date) {
        return left.date < right.date ? 1 : -1
      }

      return left.filename.localeCompare(right.filename)
    })
  const topics = collectTopics(root, notes)
  const problems = collectProblems(root)
  const languages = [
    ...new Set(problems.flatMap((problem) => problem.languages)),
  ].sort((left, right) => left.localeCompare(right))

  return {
    generatedAt: snapshotDate(notes, topics),
    topics,
    notes,
    problems,
    counts: {
      topics: topics.length,
      notes: notes.length,
      solvedProblems: problems.length,
      languages,
    },
  }
}

export function renderRepositoryModule(snapshot) {
  return `import type { RepositorySnapshot } from '../types'\n\nexport const repositorySnapshot = ${JSON.stringify(
    snapshot,
    null,
    2
  )} as const satisfies RepositorySnapshot\n`
}
