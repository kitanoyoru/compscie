import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { App } from '../App'
import { repositorySnapshot } from '../data/generated/repository'
import { cleanTitle } from '../lib/format'
import { STORAGE_KEY } from '../state/storage'

describe('Knowledge map', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/map'
  })

  it('shows every topic with notes linked to the repository on GitHub', () => {
    render(<App />)

    for (const topic of repositorySnapshot.topics) {
      expect(screen.getByRole('heading', { name: topic.title, level: 2 })).toBeInTheDocument()
    }

    const note = repositorySnapshot.notes[0]
    const topic = repositorySnapshot.topics.find((item) => item.slug === note?.topicSlug)

    if (note === undefined || topic === undefined) {
      throw new Error('The repository snapshot has no notes.')
    }

    const expectedHref = `https://github.com/kitanoyoru/compscie/blob/main/${note.path}`
    const link = within(screen.getByRole('article', { name: topic.title }))
      .getAllByRole('link')
      .find((element) => element.getAttribute('href') === expectedHref)

    expect(link).toHaveTextContent(cleanTitle(note.title))
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('adds a topic next step to the task queue', async () => {
    const user = userEvent.setup()
    render(<App />)

    const topic = repositorySnapshot.topics.find((item) => item.next.length > 0)

    if (topic === undefined) {
      throw new Error('The repository snapshot has no topic with a next step.')
    }

    const article = screen.getByRole('article', { name: topic.title })
    await user.click(within(article).getByRole('button', { name: /add to queue/i }))

    expect(within(article).getByText(/in your queue/i)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      tasks: [{ title: topic.next, topicId: topic.slug }],
    })
  })

  it('links language bars to a filtered LeetCode view', () => {
    render(<App />)

    const chart = screen.getByRole('list', { name: /solved problems per language/i })

    expect(within(chart).getByRole('link', { name: 'Go' })).toHaveAttribute('href', '#/leetcode?language=Go')
  })

  describe('concept filter', () => {
    const hrefsIn = (list: HTMLElement): string[] =>
      within(list)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href') ?? '')

    it('filters a topic’s notes by concept', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })

      await user.click(within(go).getByRole('button', { name: 'Concurrency' }))

      const hrefs = hrefsIn(within(go).getByRole('list', { name: /notes about concurrency/i }))
      expect(hrefs.some((href) => href.endsWith('notes/go/channels.md'))).toBe(true)
      expect(hrefs.some((href) => href.endsWith('notes/go/garbage-collector.md'))).toBe(false)
      expect(hrefs).toHaveLength(7)
      expect(within(go).queryByRole('button', { name: /^show all \d+ notes$/i })).not.toBeInTheDocument()
    })

    it('restores the full list when the active concept is pressed again', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })
      const button = within(go).getByRole('button', { name: 'Concurrency' })

      expect(button).toHaveAttribute('aria-pressed', 'false')
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'true')
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'false')

      expect(within(go).queryByRole('list', { name: /notes about/i })).not.toBeInTheDocument()
      expect(within(go).getByRole('button', { name: /^show all \d+ notes$/i })).toBeInTheDocument()
    })

    it('clears the filter with Show all notes', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })

      await user.click(within(go).getByRole('button', { name: 'Memory' }))
      await user.click(within(go).getByRole('button', { name: 'Show all notes' }))

      expect(within(go).getByRole('button', { name: 'Memory' })).toHaveAttribute('aria-pressed', 'false')
      expect(within(go).queryByRole('button', { name: 'Show all notes' })).not.toBeInTheDocument()
      expect(within(go).queryByRole('list', { name: /notes about/i })).not.toBeInTheDocument()
    })

    it('keeps unmapped notes out of filtered lists', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })

      for (const concept of ['Runtime', 'Concurrency', 'Memory', 'Production diagnostics']) {
        await user.click(within(go).getByRole('button', { name: concept }))
        const hrefs = hrefsIn(within(go).getByRole('list', { name: `Notes about ${concept}` }))
        expect(hrefs.some((href) => /go\/(interfaces|generics)\.md$/.test(href))).toBe(false)
        await user.click(within(go).getByRole('button', { name: concept }))
      }
    })

    it('announces the filter and shows the visible count', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })
      const status = within(go).getByRole('status')

      expect(status).toBeEmptyDOMElement()
      await user.click(within(go).getByRole('button', { name: 'Concurrency' }))
      expect(status).toHaveTextContent('Showing 7 of 19 notes about Concurrency')
      expect(within(go).getByRole('heading', { name: /7 of 19 notes/ })).toBeInTheDocument()

      await user.click(within(go).getByRole('button', { name: 'Concurrency' }))
      expect(status).toBeEmptyDOMElement()
    })

    it('returns focus to the active concept after Show all notes', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })

      await user.click(within(go).getByRole('button', { name: 'Memory' }))
      await user.click(within(go).getByRole('button', { name: 'Show all notes' }))

      expect(within(go).getByRole('button', { name: 'Memory' })).toHaveFocus()
    })

    it('does not affect other topic cards', async () => {
      const user = userEvent.setup()
      render(<App />)
      const go = screen.getByRole('article', { name: 'Go' })
      const clickhouse = screen.getByRole('article', { name: 'ClickHouse' })
      const before = within(clickhouse).getAllByRole('link').length

      await user.click(within(go).getByRole('button', { name: 'Runtime' }))

      expect(within(clickhouse).getAllByRole('link')).toHaveLength(before)
      expect(within(clickhouse).queryByRole('list', { name: /notes about/i })).not.toBeInTheDocument()
      expect(within(clickhouse).getByRole('button', { name: 'Sparse indexing' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })
  })
})
