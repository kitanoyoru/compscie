import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { generateNoteContent } from './notes.mjs'

const note = (slug) => ({ topicSlug: 'demo', slug, path: `notes/demo/${slug}.md` })

async function render(fixture, slugs) {
  const outDir = mkdtempSync(path.join(tmpdir(), 'compscie-notes-'))

  try {
    await generateNoteContent({
      repoRoot: new URL(`../fixtures/${fixture}`, import.meta.url),
      notes: slugs.map(note),
      outDir,
    })

    return Object.fromEntries(
      slugs.map((slug) => [slug, JSON.parse(readFileSync(path.join(outDir, 'demo', `${slug}.json`), 'utf8'))])
    )
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
}

test('renders notes with GitHub heading ids and a table of contents', async () => {
  const { a } = await render('notes-render', ['a', 'b'])

  assert.equal(a.path, 'notes/demo/a.md')
  assert.deepEqual(
    a.toc.map((heading) => [heading.id, heading.depth]),
    [
      ['questions-this-answers', 2],
      ['notes', 2],
      ['same-heading', 3],
      ['same-heading-1', 3],
    ]
  )
  assert.doesNotMatch(a.html, /<h1/)
  assert.match(a.html, /<blockquote class="note-lead">/)
  assert.match(a.html, /<h3 id="same-heading-1" tabindex="-1">/)
})

test('rewrites links for the hash router and GitHub', async () => {
  const { a, b } = await render('notes-render', ['a', 'b'])

  assert.match(a.html, /href="#\/notes\/demo\/b">B</)
  assert.match(a.html, /href="#\/notes\/demo\/b\?section=details">/)
  assert.match(a.html, /href="#\/notes\/demo\/a\?section=same-heading-1">/)
  assert.match(
    a.html,
    /href="https:\/\/github\.com\/kitanoyoru\/compscie\/blob\/main\/notes\/demo\/labs\/run\.sql" target="_blank" rel="noreferrer">lab<\/a><span class="sr-only"> \(opens in a new tab\)<\/span>/
  )
  assert.match(a.html, /href="https:\/\/github\.com\/kitanoyoru\/compscie\/tree\/main\/notes\/demo\/labs"/)
  assert.match(a.html, /href="https:\/\/example\.com" target="_blank" rel="noreferrer">a site</)
  assert.match(b.html, /href="#\/notes\/demo\/a">A</)
})

test('wraps tables in a focusable scroll container', async () => {
  const { b } = await render('notes-render', ['a', 'b'])

  assert.match(b.html, /<div class="table-scroll" tabindex="0" role="group" aria-label="Table"><table>.*<\/table>\n?<\/div>/s)
})

test('highlights code in a labelled, focusable group and keeps Mermaid as source', async () => {
  const { a } = await render('notes-render', ['a', 'b'])

  assert.match(a.html, /<div class="code-block" tabindex="0" role="group" aria-label="go code"><pre class="shiki/)
  assert.match(a.html, /<figure class="note-diagram">.*aria-label="Mermaid diagram source"/s)
  assert.match(a.html, /<figcaption>Mermaid diagram\. <a href="https:\/\/github\.com\/kitanoyoru\/compscie\/blob\/main\/notes\/demo\/a\.md"/)
})

test('fails the build on links to missing notes, files, or headings', async () => {
  await assert.rejects(
    () => render('notes-broken', ['c', 'd']),
    (error) => {
      assert.match(error.message, /notes\/demo\/c\.md: "missing\.md" points to notes\/demo\/missing\.md, which does not exist/)
      assert.match(error.message, /notes\/demo\/c\.md: "d\.md#nope" has no heading "#nope" in notes\/demo\/d\.md/)
      return true
    }
  )
})
