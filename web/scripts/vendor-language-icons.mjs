// Writes src/data/language-icons.json from tools/languages.json and the simple-icons package.
// Only languages the repository has solutions in are written, to keep the bundle small.
// Run it whenever a solution in a new language lands (a unit test fails until you do):
//
//   yarn --cwd web run vendor:icons
//
// Each glyph is measured in Chromium (Playwright) and gets a tight `viewBox` plus an `aspect`
// (width / height, from 1 to MAX_ASPECT), so wide wordmarks such as Go render wider instead of
// smaller. Each icon gets a `light` and a `dark` color. Both start from the registry's linguist color
// and are darkened (light theme) or lightened (dark theme) until they reach 3:1 contrast
// against every surface an icon can sit on, as WCAG 1.4.11 asks of meaningful graphics.

import { readFileSync, writeFileSync } from 'node:fs'
import * as simpleIcons from 'simple-icons'

import { adjustForContrast as adjustColor } from './lib/color.mjs'

import { collectRepositorySnapshot } from './repository-data.mjs'

const REGISTRY_URL = new URL('../../tools/languages.json', import.meta.url)
const OUTPUT_URL = new URL('../src/data/language-icons.json', import.meta.url)

/**
 * Backgrounds from src/styles/global.css that icons sit on: --surface, --surface-sunken,
 * --surface-hover, and --accent-soft (the selected problem row).
 */
export const ICON_BACKGROUNDS = {
  light: ['#fcfcfb', '#f1f1ed', '#efefea', '#eaf1fb'],
  dark: ['#1a1a19', '#161615', '#232321', '#172334'],
}
export const MIN_ICON_CONTRAST = 3
/** Widest box an icon may take, as a multiple of its height. */
export const MAX_ASPECT = 1.75
const BOX_PADDING = 0.5

/** Icons that simple-icons does not provide. Drawn on the same 24 × 24 grid. */
const LOCAL_ICONS = {
  // A database: a lid and two bands.
  SQL: 'M4 6.25a8 3.5 0 1 0 16 0a8 3.5 0 1 0-16 0zM4 8.25V12a8 3.5 0 0 0 16 0V8.25a8 3.5 0 0 1-16 0zM4 14v3.75a8 3.5 0 0 0 16 0V14a8 3.5 0 0 1-16 0z',
}

/** simple-icons has no Java mark; its OpenJDK mark (Duke) stands in for it. */
const ICON_SLUG_OVERRIDES = {
  Java: 'openjdk',
}

/** Icon colors only need the 3:1 of WCAG 1.4.11 (non-text contrast). */
export function adjustForContrast(hex, backgrounds, direction) {
  return adjustColor(hex, backgrounds, direction, MIN_ICON_CONTRAST)
}

async function measureGlyphs(paths) {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()

    return await page.evaluate((pathData) => {
      const namespace = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(namespace, 'svg')
      document.body.append(svg)

      return pathData.map((d) => {
        const path = document.createElementNS(namespace, 'path')
        path.setAttribute('d', d)
        svg.append(path)
        const { x, y, width, height } = path.getBBox()
        path.remove()
        return { x, y, width, height }
      })
    }, paths)
  } finally {
    await browser.close()
  }
}

const round = (value) => Math.round(value * 100) / 100

/** Pads the glyph's box, then widens it to a square or shortens it to MAX_ASPECT, keeping it centered. */
export function fitBox({ x, y, width, height }) {
  let boxWidth = width + BOX_PADDING * 2
  let boxHeight = height + BOX_PADDING * 2

  if (boxWidth < boxHeight) {
    boxWidth = boxHeight
  } else if (boxWidth / boxHeight > MAX_ASPECT) {
    boxHeight = boxWidth / MAX_ASPECT
  }

  const left = x + width / 2 - boxWidth / 2
  const top = y + height / 2 - boxHeight / 2

  return {
    viewBox: [left, top, boxWidth, boxHeight].map(round).join(' '),
    aspect: round(boxWidth / boxHeight),
  }
}

function pascalCase(slug) {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

function iconPath(language) {
  if (LOCAL_ICONS[language.name] !== undefined) {
    return { path: LOCAL_ICONS[language.name], source: 'local' }
  }

  const slug = ICON_SLUG_OVERRIDES[language.name] ?? language.icon

  if (slug === null || slug === undefined) {
    return undefined
  }

  const icon = simpleIcons[`si${pascalCase(slug)}`]

  if (icon === undefined) {
    throw new Error(`simple-icons has no icon "${slug}" for ${language.name}`)
  }

  return { path: icon.path, source: `simple-icons:${icon.slug}` }
}

async function main() {
  const { languages } = JSON.parse(readFileSync(REGISTRY_URL, 'utf8'))
  const used = new Set(collectRepositorySnapshot(new URL('../..', import.meta.url)).counts.languages)
  const entries = languages
    .filter((language) => used.has(language.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((language) => ({ language, icon: iconPath(language) }))
    .filter((entry) => entry.icon !== undefined)
  const boxes = await measureGlyphs(entries.map((entry) => entry.icon.path))
  const icons = {}

  entries.forEach(({ language, icon }, index) => {
    icons[language.name] = {
      path: icon.path,
      ...fitBox(boxes[index]),
      source: icon.source,
      light: adjustForContrast(language.color, ICON_BACKGROUNDS.light, 'darker'),
      dark: adjustForContrast(language.color, ICON_BACKGROUNDS.dark, 'lighter'),
    }
  })

  writeFileSync(OUTPUT_URL, `${JSON.stringify(icons, null, 2)}\n`)
  console.log(`Wrote ${Object.keys(icons).length} language icons to src/data/language-icons.json`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main()
}
