// Renders every note to HTML at build time:
//
//   public/content/notes/<topic>/<slug>.json   { path, html, toc: [{ id, text, depth }] }
//
// - Heading ids come from github-slugger, so anchors match GitHub's and old links keep working.
// - Links are rewritten for the hash router: a note link becomes `#/notes/<topic>/<slug>`, and an
//   anchor becomes `?section=<id>`, because the router owns the URL hash. Other repository files
//   link to GitHub, and every link is checked: a missing note, file, or heading fails the build.
// - Code is highlighted like solutions; Mermaid stays source, with a link to GitHub's rendering.
// - The note's own `# Title` is dropped (the page renders it) and the opening blockquote, the
//   note's summary, gets the `note-lead` class.

import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import GithubSlugger from 'github-slugger'
import MarkdownIt from 'markdown-it'

import { createCodeHighlighter } from './highlighter.mjs'

const REPOSITORY_URL = 'https://github.com/kitanoyoru/compscie'
const FENCE_LANGUAGES = { go: 'go', sql: 'sql', sh: 'shellscript', bash: 'shellscript', shell: 'shellscript' }
const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>'

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function encodePath(repositoryPath) {
  return repositoryPath.split('/').map(encodeURIComponent).join('/')
}

function githubUrl(repositoryPath, kind) {
  return `${REPOSITORY_URL}/${kind}/main/${encodePath(repositoryPath)}`
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character])
}

/** Plain text of an inline token: text and code spans, as GitHub uses for heading anchors. */
function inlineText(token) {
  return (token.children ?? [])
    .filter((child) => child.type === 'text' || child.type === 'code_inline')
    .map((child) => child.content)
    .join('')
}

/** Heading ids for one note, in document order, with GitHub's de-duplication (`notes`, `notes-1`). */
function headingIds(md, source) {
  const slugger = new GithubSlugger()
  const tokens = md.parse(source, {})
  const headings = []

  tokens.forEach((token, index) => {
    if (token.type === 'heading_open') {
      const text = inlineText(tokens[index + 1])
      headings.push({ id: slugger.slug(text), text, depth: Number(token.tag.slice(1)) })
    }
  })

  return headings
}

function noteRoute(note, section) {
  const route = `#/notes/${note.topicSlug}/${note.slug}`

  return section === undefined || section === '' ? route : `${route}?section=${encodeURIComponent(section)}`
}

/**
 * @param {object} options
 * @param {string | URL} options.repoRoot
 * @param {readonly { topicSlug: string, slug: string, path: string }[]} options.notes
 * @param {string | URL} options.outDir
 */
export async function generateNoteContent({ repoRoot, notes, outDir }) {
  const toPath = (value) => (value instanceof URL ? fileURLToPath(value) : value)
  const root = toPath(repoRoot)
  const out = toPath(outDir)
  const md = new MarkdownIt({ html: false, linkify: true })
  const sources = new Map(
    notes.map((note) => [note.path, stripFrontmatter(readFileSync(path.join(root, note.path), 'utf8'))])
  )
  const headings = new Map(notes.map((note) => [note.path, headingIds(md, sources.get(note.path))]))
  const notesByPath = new Map(notes.map((note) => [note.path, note]))
  const highlighter = await createCodeHighlighter([...new Set(Object.values(FENCE_LANGUAGES))])
  const broken = []

  try {
    md.renderer.rules.fence = (tokens, index, _options, env) => {
      const token = tokens[index]
      const language = token.info.trim().split(/\s+/)[0] ?? ''
      const code = token.content.replace(/\n$/, '')

      if (language === 'mermaid') {
        return (
          `<figure class="note-diagram"><div class="code-block" tabindex="0" role="group" aria-label="Mermaid diagram source">` +
          `${highlighter.highlight(code, 'text')}</div><figcaption>Mermaid diagram. ` +
          `<a href="${githubUrl(env.note.path, 'blob')}" target="_blank" rel="noreferrer">See it rendered on GitHub</a>${NEW_TAB}.` +
          `</figcaption></figure>\n`
        )
      }

      const label = language === '' || language === 'text' ? 'Code' : `${language} code`

      return (
        `<div class="code-block" tabindex="0" role="group" aria-label="${escapeHtml(label)}">` +
        `${highlighter.highlight(code, FENCE_LANGUAGES[language] ?? 'text')}</div>\n`
      )
    }

    md.core.ruler.push('compscie_notes', (state) => {
      const { note } = state.env
      const ids = headings.get(note.path)
      let headingIndex = 0
      let seenH2 = false
      let leadMarked = false

      for (let index = 0; index < state.tokens.length; index += 1) {
        const token = state.tokens[index]

        if (token.type === 'heading_open') {
          const heading = ids[headingIndex]
          headingIndex += 1
          token.attrSet('id', heading.id)
          token.attrSet('tabindex', '-1')
          seenH2 ||= token.tag === 'h2'
        }

        if (token.type === 'blockquote_open' && !seenH2 && !leadMarked) {
          token.attrJoin('class', 'note-lead')
          leadMarked = true
        }

        for (const child of token.children ?? []) {
          if (child.type === 'link_open') {
            rewriteLink(child, note)
          }
        }
      }

      // The page renders the title; drop the note's own h1 and its inline content.
      const h1 = state.tokens.findIndex((token) => token.type === 'heading_open' && token.tag === 'h1')

      if (h1 !== -1) {
        state.tokens.splice(h1, 3)
      }
    })

    md.renderer.rules.link_close = (tokens, index, options, env, self) => {
      const open = tokens.slice(0, index).findLast((token) => token.type === 'link_open' && token.level === tokens[index].level)

      return self.renderToken(tokens, index, options) + (open?.attrGet('target') === '_blank' ? NEW_TAB : '')
    }

    function rewriteLink(token, note) {
      const href = token.attrGet('href') ?? ''
      const external = () => {
        token.attrSet('target', '_blank')
        token.attrSet('rel', 'noreferrer')
      }

      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        external()
        return
      }

      const hashIndex = href.indexOf('#')
      const target = decodeURIComponent(hashIndex === -1 ? href : href.slice(0, hashIndex))
      const section = hashIndex === -1 ? undefined : decodeURIComponent(href.slice(hashIndex + 1))
      const resolved = target === '' ? note.path : path.posix.normalize(path.posix.join(path.posix.dirname(note.path), target))
      const linked = notesByPath.get(resolved)

      if (linked !== undefined) {
        if (section !== undefined && !headings.get(linked.path).some((heading) => heading.id === section)) {
          broken.push(`${note.path}: "${href}" has no heading "#${section}" in ${linked.path}`)
        }

        token.attrSet('href', noteRoute(linked, section))
        return
      }

      const absolute = path.join(root, resolved)

      if (!existsSync(absolute)) {
        broken.push(`${note.path}: "${href}" points to ${resolved}, which does not exist`)
        return
      }

      const kind = statSync(absolute).isDirectory() ? 'tree' : 'blob'
      token.attrSet('href', `${githubUrl(resolved.replace(/\/$/, ''), kind)}${section === undefined ? '' : `#${section}`}`)
      external()
    }

    const rendered = notes.map((note) => ({
      note,
      html: md.render(sources.get(note.path), { note }),
      toc: headings
        .get(note.path)
        .filter((heading) => heading.depth === 2 || heading.depth === 3),
    }))

    if (broken.length > 0) {
      throw new Error(`Broken links in notes:\n  ${broken.join('\n  ')}`)
    }

    rmSync(out, { recursive: true, force: true })

    for (const { note, html, toc } of rendered) {
      const target = path.join(out, note.topicSlug, `${note.slug}.json`)
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, JSON.stringify({ path: note.path, html, toc }))
    }

    return { written: rendered.length }
  } finally {
    highlighter.dispose()
  }
}
