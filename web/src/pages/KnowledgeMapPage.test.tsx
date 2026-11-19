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
})
