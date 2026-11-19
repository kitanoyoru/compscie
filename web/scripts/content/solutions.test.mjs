import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { contrastRatio } from '../lib/color.mjs'
import { collectRepositorySnapshot, loadShikiLanguages } from '../repository-data.mjs'
import { CODE_BACKGROUNDS, MIN_TEXT_CONTRAST, createCodeHighlighter } from './highlighter.mjs'
import { generateSolutionContent } from './solutions.mjs'

const validFixtureRoot = new URL('../fixtures/valid', import.meta.url)

test('highlights with both themes as custom properties and AA contrast', async () => {
  const highlighter = await createCodeHighlighter(['go'])

  try {
    const html = highlighter.highlight('// comment\nfunc main() {\n\treturn "text"\n}', 'go')

    assert.match(html, /^<pre class="shiki/)
    assert.doesNotMatch(html, /tabindex/)
    assert.doesNotMatch(html, /[^-]color:/)

    const colors = [...html.matchAll(/--shiki-(light|dark):(#[0-9A-Fa-f]{6})/g)]
    assert.ok(colors.length > 4)

    for (const [, theme, hex] of colors) {
      for (const background of CODE_BACKGROUNDS[theme]) {
        assert.ok(
          contrastRatio(hex, background) >= MIN_TEXT_CONTRAST,
          `${theme} ${hex} on ${background} is ${contrastRatio(hex, background).toFixed(2)}:1`
        )
      }
    }
  } finally {
    highlighter.dispose()
  }
})

test('falls back to plain text for a language it does not know', async () => {
  const highlighter = await createCodeHighlighter(['go'])

  try {
    assert.match(highlighter.highlight('x = 1', 'brainfuck'), /x = 1/)
  } finally {
    highlighter.dispose()
  }
})

test('writes one file per problem, skips unchanged problems, and removes stale ones', async () => {
  const outDir = mkdtempSync(path.join(tmpdir(), 'compscie-solutions-'))
  const { problems } = collectRepositorySnapshot(validFixtureRoot)
  const options = { repoRoot: validFixtureRoot, problems, outDir, shikiLanguages: loadShikiLanguages() }

  try {
    assert.deepEqual(await generateSolutionContent(options), { written: 1, skipped: 0, removed: 0 })

    const content = JSON.parse(readFileSync(path.join(outDir, '1.json'), 'utf8'))
    assert.equal(content.problemId, 1)
    assert.deepEqual(
      content.files.map((file) => [file.language, file.file]),
      [
        ['Go', 'main.go'],
        ['TypeScript', 'main.ts'],
      ]
    )
    for (const file of content.files) {
      assert.ok(file.lines > 0)
      assert.match(file.html, /--shiki-light:/)
    }

    writeFileSync(path.join(outDir, '99.json'), '{}')
    assert.deepEqual(await generateSolutionContent(options), { written: 0, skipped: 1, removed: 1 })
    assert.equal(existsSync(path.join(outDir, '99.json')), false)
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
})
