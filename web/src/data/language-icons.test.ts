import { describe, expect, it } from 'vitest'

import css from '../styles/global.css?raw'
import { contrastRatio } from '../lib/contrast'
import { repositorySnapshot } from './generated/repository'
import icons from './language-icons.json'

const SURFACES = ['--surface', '--surface-sunken', '--surface-hover'] as const

/** Reads the surface tokens from the first rule whose selector is exactly `selector`. */
function surfaceTokens(selector: string): string[] {
  const start = css.indexOf(`${selector} {`)
  expect(start, `${selector} block in global.css`).toBeGreaterThanOrEqual(0)
  const block = css.slice(start, css.indexOf('}', start))

  return SURFACES.map((token) => {
    const value = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6});`).exec(block)?.[1]
    expect(value, `${token} in ${selector}`).toBeDefined()
    return value ?? ''
  })
}

const lightSurfaces = surfaceTokens(':root')
const darkSurfaces = surfaceTokens(':root[data-theme="dark"]')

describe('language icons', () => {
  it.each(Object.entries(icons))('%s clears 3:1 on every card surface in both themes', (_, icon) => {
    for (const surface of lightSurfaces) {
      expect(contrastRatio(icon.light, surface)).toBeGreaterThanOrEqual(3)
    }
    for (const surface of darkSurfaces) {
      expect(contrastRatio(icon.dark, surface)).toBeGreaterThanOrEqual(3)
    }
  })

  it('covers every language in the repository (run `yarn --cwd web run vendor:icons` after adding one)', () => {
    const missing = repositorySnapshot.counts.languages.filter((language) => !Object.hasOwn(icons, language))

    expect(missing).toEqual([])
  })
})
