import { render } from '@testing-library/react'
import { beforeEach, describe, it } from 'vitest'

import { App } from './App'
import { expectNoAxeViolations } from './test/axe'
import { seedLearningState } from './test/fixtures'

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
