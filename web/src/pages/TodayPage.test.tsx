import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'

describe('Today dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a task, recommends it, and completes it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/task title/i), 'Run the date-parts lab')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('heading', { name: /run the date-parts lab/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /complete run the date-parts lab/i }))

    expect(screen.getByText(/completed this week: 1/i)).toBeInTheDocument()
  })

  it('supports keyboard navigation and form submission', async () => {
    const user = userEvent.setup()
    render(<App />)

    const todayLink = screen.getByRole('link', { name: /today/i })
    await user.tab()
    expect(todayLink).toHaveFocus()
    expect(todayLink).toHaveAttribute('aria-current', 'page')

    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/task title/i), 'Practice slice internals')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: /practice slice internals/i })).toBeInTheDocument()
  })

  it('defers a task and confirms reset', async () => {
    const user = userEvent.setup()
    const confirmReset = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)

    await user.type(screen.getByLabelText(/task title/i), 'Read the granule note')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.click(screen.getByRole('button', { name: /defer read the granule note/i }))

    expect(screen.getByText(/deferred/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset working state/i }))

    expect(confirmReset).toHaveBeenCalledWith(
      'Reset all tasks and practice sessions stored in this browser?',
    )
    expect(screen.queryByRole('heading', { name: /read the granule note/i })).not.toBeInTheDocument()
    confirmReset.mockRestore()
  })
})
