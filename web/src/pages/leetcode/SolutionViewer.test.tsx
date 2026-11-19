import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../../App'
import { loadSolutions } from '../../data/content'
import { sampleSolutions } from '../../test/solution-content'

vi.mock('../../data/content', () => ({ loadSolutions: vi.fn() }))

const load = vi.mocked(loadSolutions)

async function openViewer(user: ReturnType<typeof userEvent.setup>): Promise<HTMLElement> {
  await user.click(screen.getByRole('button', { name: /show my solution/i }))

  return screen.findByRole('tablist', { name: 'Solutions' })
}

describe('solution viewer', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    load.mockReset()
    load.mockImplementation(async (id) => sampleSolutions(id))
    window.location.hash = '#/leetcode?problem=1'
  })

  it('stays collapsed and unloaded until asked, so a review starts from memory', () => {
    render(<App />)

    const toggle = screen.getByRole('button', { name: /show my solution/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /solution, main\.go/i })).not.toBeInTheDocument()
    expect(load).not.toHaveBeenCalled()
  })

  it('loads the problem’s files and shows one tab per file', async () => {
    const user = userEvent.setup()
    render(<App />)

    const tablist = await openViewer(user)

    expect(load).toHaveBeenCalledWith(1)
    expect(screen.getByRole('button', { name: /hide code/i })).toHaveAttribute('aria-expanded', 'true')
    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Go', 'Python', 'Python (2)'])
    expect(within(tablist).getByRole('tab', { name: 'Go' })).toHaveAttribute('aria-selected', 'true')

    const code = screen.getByRole('region', { name: 'Go solution, main.go' })
    expect(code).toHaveAttribute('tabindex', '0')
    expect(code).toHaveTextContent('package main')
    expect(screen.getByRole('tabpanel', { name: 'Go' })).toHaveTextContent('3 lines')
    expect(screen.getByRole('link', { name: /^github/i })).toHaveAttribute(
      'href',
      expect.stringMatching(new RegExp(`${encodeURIComponent('0001. Two Sum')}/main\\.go$`)),
    )
  })

  it('moves between tabs with the arrow keys, Home, and End', async () => {
    const user = userEvent.setup()
    render(<App />)
    const tablist = await openViewer(user)
    const tab = (name: string) => within(tablist).getByRole('tab', { name })

    tab('Go').focus()
    await user.keyboard('{ArrowRight}')
    expect(tab('Python')).toHaveFocus()
    expect(tab('Python')).toHaveAttribute('aria-selected', 'true')
    expect(tab('Go')).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('region', { name: 'Python solution, main.py' })).toHaveTextContent('print(1)')

    await user.keyboard('{End}')
    expect(tab('Python (2)')).toHaveFocus()
    expect(screen.getByRole('region', { name: 'Python (2) solution, alt.py' })).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(tab('Go')).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(tab('Python (2)')).toHaveFocus()

    await user.keyboard('{Home}')
    expect(tab('Go')).toHaveAttribute('aria-selected', 'true')
  })

  it('copies the selected file and confirms with a toast', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openViewer(user)

    await user.click(screen.getByRole('button', { name: /^copy$/i }))

    await expect(navigator.clipboard.readText()).resolves.toBe('package main\n\nfunc main() {}')
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent('Copied main.go')
  })

  it('explains how to build content when it is missing', async () => {
    load.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /show my solution/i }))

    expect(await screen.findByText(/solution not built yet/i)).toHaveTextContent(
      'yarn --cwd web run generate:data',
    )
    expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute(
      'href',
      expect.stringContaining('/tree/'),
    )
  })

  it('hides the code again without reloading it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openViewer(user)

    await user.click(screen.getByRole('button', { name: /hide code/i }))
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()

    await openViewer(user)
    expect(load).toHaveBeenCalledTimes(1)
  })
})
