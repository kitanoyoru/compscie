import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'
import { loadNoteHeadings } from '../data/content'

vi.mock('../data/content', () => ({
  loadNoteHeadings: vi.fn(),
  loadNote: vi.fn(async () => undefined),
  loadSolutions: vi.fn(async () => undefined),
}))

function palette(): HTMLElement {
  return screen.getByRole('dialog', { name: 'Search' })
}

describe('command palette', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
    vi.mocked(loadNoteHeadings).mockResolvedValue([
      { topicSlug: 'go', slug: 'channels', headings: [{ id: 'hchan-struct', text: 'hchan struct' }] },
    ])
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it.each(['{Control>}k{/Control}', '{Meta>}k{/Meta}'])('opens with %s and lists pages and actions', async (keys) => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard(keys)

    const input = within(palette()).getByRole('combobox', { name: 'Search the workspace' })
    expect(input).toHaveFocus()
    expect(within(palette()).getAllByRole('option').map((option) => option.getAttribute('aria-label'))).toEqual([
      'Today, Page',
      'Review, Page',
      'Knowledge Map, Page',
      'LeetCode, Page',
      'Switch to dark theme, Action',
      'Open settings, Action',
    ])
  })

  it('moves the active option with the arrow keys and opens it with Enter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Search' }))
    const input = within(palette()).getByRole('combobox')

    await user.type(input, 'two sum')
    const options = within(palette()).getAllByRole('option')
    expect(options[0]).toHaveAccessibleName('Two Sum, #1, Problem')
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id)

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', options[1]!.id)
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowUp}{Enter}')

    expect(window.location.hash).toBe('#/leetcode?problem=1')
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument()
  })

  it('finds problems by number', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')

    await user.type(within(palette()).getByRole('combobox'), '#1')

    expect(within(palette()).getAllByRole('option')[0]).toHaveAccessibleName('Two Sum, #1, Problem')
  })

  it('searches note sections once the heading index loads', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')

    await user.type(within(palette()).getByRole('combobox'), 'hchan')

    const option = await within(palette()).findByRole('option', { name: 'hchan struct, Go Channels, Section' })
    await user.click(option)
    expect(window.location.hash).toBe('#/notes/go/channels?section=hchan-struct')
  })

  it('runs actions: theme and settings', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('{Control>}k{/Control}')
    await user.click(within(palette()).getByRole('option', { name: 'Switch to dark theme, Action' }))
    expect(document.documentElement.dataset.theme).toBe('dark')

    await user.keyboard('{Control>}k{/Control}')
    await user.click(within(palette()).getByRole('option', { name: 'Open settings, Action' }))
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  it('opens a topic on the Knowledge Map with its card focused', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')

    await user.type(within(palette()).getByRole('combobox'), 'clickhouse')
    await user.click(within(palette()).getByRole('option', { name: /^ClickHouse, .*, Topic$/ }))

    expect(window.location.hash).toBe('#/map?topic=clickhouse')
    await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: 'ClickHouse' })).toHaveFocus())
  })

  it('closes with Escape and returns focus to the button that opened it', async () => {
    const user = userEvent.setup()
    render(<App />)
    const button = screen.getByRole('button', { name: 'Search' })

    await user.click(button)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument()
    expect(button).toHaveFocus()
  })

  it('says when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')

    await user.type(within(palette()).getByRole('combobox'), 'zzzzqq')

    expect(within(palette()).queryByRole('listbox')).not.toBeInTheDocument()
    expect(within(palette()).getByText('No matches for “zzzzqq”.')).toBeInTheDocument()
    expect(within(palette()).getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('stays closed while another dialog is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Settings' }))

    await user.keyboard('{Control>}k{/Control}')

    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument()
  })
})
