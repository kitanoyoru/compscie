import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'
import { loadNote } from '../data/content'
import { repositorySnapshot } from '../data/generated/repository'
import { cleanTitle } from '../lib/format'
import { sampleNote } from '../test/note-content'

vi.mock('../data/content', () => ({ loadNote: vi.fn(), loadSolutions: vi.fn() }))

const load = vi.mocked(loadNote)
const goNotes = repositorySnapshot.notes.filter((note) => note.topicSlug === 'go')
const channels = goNotes.find((note) => note.slug === 'channels')!

describe('note reader', () => {
  beforeEach(() => {
    localStorage.clear()
    load.mockReset()
    load.mockImplementation(async (topic, slug) => sampleNote(`notes/${topic}/${slug}.md`))
    window.location.hash = '#/notes/go/channels'
  })

  it('shows the note with its breadcrumb, date, concepts, and contents', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: cleanTitle(channels.title) })).toBeInTheDocument()
    expect(document.title).toBe(`${cleanTitle(channels.title)} · Compscie`)
    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(breadcrumb).getByRole('link', { name: 'Knowledge Map' })).toHaveAttribute('href', '#/map')
    expect(breadcrumb).toHaveTextContent('Go')
    for (const concept of channels.concepts) {
      expect(screen.getByText(concept, { selector: '.tag' })).toBeInTheDocument()
    }

    const article = screen.getByRole('article', { name: cleanTitle(channels.title) })
    expect(await within(article).findByText('A short summary.')).toBeInTheDocument()
    expect(load).toHaveBeenCalledWith('go', 'channels')
    expect(within(article).getByRole('link', { name: 'Go sync.Mutex' })).toHaveAttribute('href', '#/notes/go/mutex')

    const toc = screen.getByRole('navigation', { name: 'On this page' })
    expect(within(toc).getByRole('link', { name: 'hchan struct' })).toHaveAttribute(
      'href',
      '#/notes/go/channels?section=hchan-struct',
    )
  })

  it('moves to the section named in the URL once the note loads', async () => {
    window.location.hash = '#/notes/go/channels?section=hchan-struct'
    render(<App />)

    const heading = await screen.findByRole('heading', { name: 'hchan struct' })
    await waitFor(() => expect(heading).toHaveFocus())
  })

  it('moves to a section from the table of contents', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toc = await screen.findByRole('navigation', { name: 'On this page' })

    await user.click(within(toc).getByRole('link', { name: 'Notes' }))

    expect(window.location.hash).toBe('#/notes/go/channels?section=notes')
    await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: 'Notes' })).toHaveFocus())
  })

  it('links the neighbouring notes of the topic', () => {
    render(<App />)
    const index = goNotes.indexOf(channels)
    const pager = screen.getByRole('navigation', { name: 'More Go notes' })

    if (index > 0) {
      expect(within(pager).getByRole('link', { name: new RegExp(cleanTitle(goNotes[index - 1]!.title)) })).toHaveAttribute(
        'href',
        `#/notes/go/${goNotes[index - 1]!.slug}`,
      )
    }
    if (index < goNotes.length - 1) {
      expect(within(pager).getByRole('link', { name: new RegExp(cleanTitle(goNotes[index + 1]!.title)) })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute(
      'href',
      'https://github.com/kitanoyoru/compscie/blob/main/notes/go/channels.md',
    )
  })

  it('explains how to build a note that is missing', async () => {
    load.mockResolvedValue(undefined)
    render(<App />)

    expect(await screen.findByText(/note not built yet/i)).toHaveTextContent('yarn --cwd web run generate:data')
  })

  it('shows the not-found page for an unknown note', () => {
    window.location.hash = '#/notes/go/nope'
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(load).not.toHaveBeenCalled()
  })
})
