// Build-time syntax highlighting with Shiki. The output carries both themes as CSS custom
// properties (`--shiki-light`, `--shiki-dark`) and no colors of its own, so the app's theme
// selectors decide which one applies. Token colors are nudged to WCAG AA (4.5:1) against the
// surfaces code sits on, so a theme update cannot quietly break contrast.

import { createHighlighter } from 'shiki'

import { adjustForContrast } from '../lib/color.mjs'

export const CODE_THEMES = { light: 'github-light-default', dark: 'github-dark-default' }
/** --surface and --surface-sunken from src/styles/global.css, per theme. */
export const CODE_BACKGROUNDS = {
  light: ['#fcfcfb', '#f1f1ed'],
  dark: ['#1a1a19', '#161615'],
}
export const MIN_TEXT_CONTRAST = 4.5

const TOKEN_COLOR = /--shiki-(light|dark):(#[0-9a-fA-F]{3,8})/g

/** Drops Shiki's tabindex on <pre>: the app wraps code in its own focusable, labelled region. */
const withoutTabStop = {
  name: 'compscie:no-tab-stop',
  pre(node) {
    delete node.properties.tabindex
  },
}

export async function createCodeHighlighter(languages) {
  const highlighter = await createHighlighter({ themes: Object.values(CODE_THEMES), langs: languages })
  const loaded = new Set(highlighter.getLoadedLanguages())
  const adjusted = new Map()

  function readable(theme, hex) {
    const key = `${theme}:${hex}`

    if (!adjusted.has(key)) {
      adjusted.set(
        key,
        adjustForContrast(hex, CODE_BACKGROUNDS[theme], theme === 'light' ? 'darker' : 'lighter', MIN_TEXT_CONTRAST)
      )
    }

    return adjusted.get(key)
  }

  return {
    /** Highlighted HTML for `code`; an unknown language falls back to plain text. */
    highlight(code, language) {
      const html = highlighter.codeToHtml(code, {
        lang: loaded.has(language) ? language : 'text',
        themes: CODE_THEMES,
        defaultColor: false,
        transformers: [withoutTabStop],
      })

      return html.replace(TOKEN_COLOR, (_, theme, hex) => `--shiki-${theme}:${readable(theme, hex)}`)
    },
    dispose() {
      highlighter.dispose()
    },
  }
}
