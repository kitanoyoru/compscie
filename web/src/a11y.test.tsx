import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { expectNoAxeViolations } from './test/axe'
import { loadPersonalState } from './state/storage'
import { seedLearningState, seededState } from './test/fixtures'
import { sampleSolutions } from './test/solution-content'

vi.mock('./data/content', () => ({ loadSolutions: async (id: number) => sampleSolutions(id) }))

describe('seeded state fixture', () => {
  it('loads through the real storage layer', () => {
    localStorage.clear()
    seedLearningState()
    expect(loadPersonalState()).toEqual(seededState())
  })
})

const ROUTES = ['#/', '#/review', '#/map', '#/leetcode', '#/nope'] as const

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

describe('accessibility of the inline task editor', () => {
  it('has no WCAG A/AA violations while editing', async () => {
    localStorage.clear()
    window.location.hash = '#/'
    seedLearningState()
    const { container } = render(<App />)

    await userEvent.setup().click(screen.getByRole('button', { name: /edit read the go scheduler notes/i }))
    expect(screen.getByRole('form', { name: /edit read the go scheduler notes/i })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})

describe('accessibility of the knowledge map concept filter', () => {
  it('has no WCAG A/AA violations with a concept selected', async () => {
    localStorage.clear()
    window.location.hash = '#/map'
    const { container } = render(<App />)

    const go = screen.getByRole('article', { name: 'Go' })
    await userEvent.setup().click(within(go).getByRole('button', { name: 'Concurrency' }))
    expect(within(go).getByRole('button', { name: 'Concurrency' })).toHaveAttribute('aria-pressed', 'true')
    await expectNoAxeViolations(container)
  })
})

describe('accessibility of the settings dialog', () => {
  it('has no WCAG A/AA violations while open', async () => {
    localStorage.clear()
    window.location.hash = '#/'
    seedLearningState()
    render(<App />)

    await userEvent.setup().click(screen.getByRole('button', { name: /^settings$/i }))
    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()
    await expectNoAxeViolations(document.body)
  })
})

describe('accessibility of the solution viewer', () => {
  it('has no WCAG A/AA violations with the code open', async () => {
    localStorage.clear()
    window.location.hash = '#/leetcode?problem=1'
    const { container } = render(<App />)

    await userEvent.setup().click(screen.getByRole('button', { name: /show my solution/i }))
    expect(await screen.findByRole('tablist', { name: 'Solutions' })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})
