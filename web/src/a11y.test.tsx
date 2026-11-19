import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { App } from './App'
import { expectNoAxeViolations } from './test/axe'
import { loadPersonalState } from './state/storage'
import { seedLearningState, seededState } from './test/fixtures'

describe('seeded state fixture', () => {
  it('loads through the real storage layer', () => {
    localStorage.clear()
    seedLearningState()
    expect(loadPersonalState()).toEqual(seededState())
  })
})

const ROUTES = ['#/', '#/map', '#/leetcode'] as const

describe.each(ROUTES)('accessibility of %s', (hash) => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = hash
  })

  it('has no WCAG A/AA violations with empty state', async () => {
    const { container } = render(<App />)
    await expectNoAxeViolations(container)
  })

  it('has no WCAG A/AA violations with seeded state', async () => {
    seedLearningState()
    const { container } = render(<App />)
    await expectNoAxeViolations(container)
  })
})
