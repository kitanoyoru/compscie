import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'
import { repositorySnapshot } from '../data/generated/repository'
import { FIXTURE_NOW, seedLearningState } from '../test/fixtures'

// Seeded sessions, read in America/Los_Angeles with the clock at FIXTURE_NOW (Thursday, Nov 19):
// the first problem was flagged "needs review" on Nov 18, so it is due today; the second was
// solved cleanly on Nov 19, so it comes back on Nov 22.
const [flagged, solved] = repositorySnapshot.problems

describe('review schedule in the workspace', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(FIXTURE_NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Review page', () => {
    beforeEach(() => {
      window.location.hash = '#/review'
    })

    it('lists due problems, the coming week, and recent reflections', () => {
      seedLearningState()
      render(<App />)

      expect(screen.getByRole('heading', { level: 1, name: 'Review' })).toBeInTheDocument()
      expect(screen.getByText('1 problem due today.')).toBeInTheDocument()

      const due = screen.getByRole('list', { name: 'Problems due' })
      expect(within(due).getByRole('link', { name: new RegExp(flagged!.title) })).toHaveAttribute(
        'href',
        `#/leetcode?problem=${flagged!.id}`,
      )
      expect(due).toHaveTextContent('Due today')

      const upcoming = screen.getByRole('list', { name: 'Problems coming up' })
      expect(within(upcoming).getByRole('link', { name: new RegExp(solved!.title) })).toBeInTheDocument()
      expect(upcoming).toHaveTextContent('In 3 days')

      const reflections = screen.getByRole('region', { name: /recent reflections/i })
      expect(within(reflections).getByText('Missed the edge case with empty input.')).toBeInTheDocument()
      expect(within(reflections).getByRole('link', { name: new RegExp(flagged!.title) })).toHaveAttribute(
        'href',
        `#/leetcode?problem=${flagged!.id}`,
      )
    })

    it('explains how to start a schedule when nothing has been practiced', () => {
      render(<App />)

      const due = screen.getByRole('region', { name: 'Problems due' })
      expect(due).toHaveTextContent(/nothing due\./i)
      expect(within(due).getByRole('link', { name: /leetcode page/i })).toHaveAttribute('href', '#/leetcode')
      expect(screen.getByRole('region', { name: 'Coming up' })).toHaveTextContent(/nothing scheduled this week/i)
    })
  })

  describe('navigation badge', () => {
    beforeEach(() => {
      window.location.hash = '#/'
    })

    it('counts due problems on the Review link', () => {
      seedLearningState()
      render(<App />)

      const link = screen.getByRole('link', { name: 'Review, 1 due' })
      expect(link.querySelector('.nav-badge')).toHaveTextContent('1')
    })

    it('shows no badge when nothing is due', () => {
      render(<App />)

      expect(screen.getByRole('link', { name: 'Review' }).querySelector('.nav-badge')).toBeNull()
    })
  })

  describe('Today card', () => {
    beforeEach(() => {
      window.location.hash = '#/'
    })

    it('shows problems due today and links to the Review page', () => {
      seedLearningState()
      render(<App />)

      const card = screen.getByRole('region', { name: 'Due for review' })
      expect(within(card).getByRole('link', { name: new RegExp(flagged!.title) })).toBeInTheDocument()
      expect(within(card).queryByRole('link', { name: new RegExp(solved!.title) })).not.toBeInTheDocument()
      expect(within(card).getByRole('link', { name: /review all/i })).toHaveAttribute('href', '#/review')
    })

    it('explains the schedule when nothing is due', () => {
      render(<App />)

      expect(screen.getByRole('region', { name: 'Due for review' })).toHaveTextContent(
        /nothing due\. problems come back 1 day after “needs review”, and 3, 7, 14, 30, then 60 days/i,
      )
    })
  })

  describe('LeetCode workspace', () => {
    it('suggests the due problem first and marks its row', () => {
      seedLearningState()
      window.location.hash = '#/leetcode'
      render(<App />)

      expect(screen.getByRole('heading', { level: 2, name: new RegExp(flagged!.title) })).toBeInTheDocument()
      expect(screen.getByText('Due for review today.')).toBeInTheDocument()
      expect(screen.getByText(/1 due for review/)).toBeInTheDocument()

      const row = screen.getByRole('button', { name: new RegExp(`^${flagged!.title}, problem ${flagged!.id},.*due for review`, 'i') })
      expect(within(row).getByText('Due')).toBeInTheDocument()
    })

    it('tells when a selected problem comes back', () => {
      seedLearningState()
      window.location.hash = `#/leetcode?problem=${solved!.id}`
      render(<App />)

      expect(screen.getByText('Next review Nov 22.')).toBeInTheDocument()
    })
  })
})
