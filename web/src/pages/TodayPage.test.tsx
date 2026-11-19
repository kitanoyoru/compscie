import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'
import { repositorySnapshot } from '../data/generated/repository'
import { getTodayRecommendation } from '../domain/recommendations'
import { STORAGE_KEY, emptyPersonalState } from '../state/storage'
import { seedLearningState, seededState } from '../test/fixtures'

describe('Today dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
  })

  it('adds a task, recommends it, and completes it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/task title/i), 'Run the date-parts lab')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('heading', { name: /run the date-parts lab/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /complete run the date-parts lab/i }))

    expect(screen.getByRole('region', { name: /this week/i })).toHaveTextContent(/1 task completed/i)
    expect(screen.queryByRole('heading', { name: /run the date-parts lab/i })).not.toBeInTheDocument()
  })

  it('supports keyboard navigation and form submission', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()
    expect(screen.getByRole('button', { name: /skip to content/i })).toHaveFocus()

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

    expect(
      within(screen.getByRole('list', { name: /deferred tasks/i })).getByText('Read the granule note'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset working state/i }))

    expect(confirmReset).toHaveBeenCalledWith(
      'Reset all tasks and practice sessions stored in this browser?',
    )
    expect(screen.queryByRole('heading', { name: /read the granule note/i })).not.toBeInTheDocument()
    confirmReset.mockRestore()
  })

  it('queues the topic fallback as a task', async () => {
    const fallback = getTodayRecommendation(repositorySnapshot, emptyPersonalState())

    if (fallback.kind !== 'topic') {
      throw new Error('The repository snapshot has no active topic to recommend.')
    }

    const user = userEvent.setup()
    render(<App />)

    const nextAction = screen.getByRole('region', { name: fallback.next })
    await user.click(within(nextAction).getByRole('button', { name: /add to queue/i }))

    expect(within(screen.getByRole('list', { name: /open tasks/i })).getByText(fallback.next)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      tasks: [{ title: fallback.next, topicId: fallback.topicSlug, status: 'open' }],
    })
  })

  it('resumes a deferred task, reopens a completed one, and deletes tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/task title/i), 'Write the sparse index summary')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.click(screen.getByRole('button', { name: /defer write the sparse index summary/i }))
    await user.click(screen.getByRole('button', { name: /resume write the sparse index summary/i }))

    expect(
      within(screen.getByRole('list', { name: /open tasks/i })).getByText('Write the sparse index summary'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /complete write the sparse index summary/i }))
    await user.click(screen.getByRole('button', { name: /reopen write the sparse index summary/i }))

    expect(
      within(screen.getByRole('list', { name: /open tasks/i })).getByText('Write the sparse index summary'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /delete write the sparse index summary/i }))

    expect(screen.queryByText('Write the sparse index summary')).not.toBeInTheDocument()
    expect(screen.getByText(/your queue is empty/i)).toBeInTheDocument()
  })

  it('undoes a deleted task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task title/i), 'Read the GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /delete read the gc note/i }))
    expect(screen.queryByRole('button', { name: /delete read the gc note/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(/deleted “read the gc note”/i)

    await user.click(screen.getByRole('button', { name: /^undo$/i }))
    expect(screen.getByRole('button', { name: /delete read the gc note/i })).toBeInTheDocument()
  })

  it('undo after completing a deferred task restores it as deferred', async () => {
    const deferred = seededState().tasks.find((task) => task.status === 'deferred')

    if (deferred === undefined) {
      throw new Error('fixtures need a deferred task')
    }

    seedLearningState()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: `Complete ${deferred.title}` }))
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(
      `Completed “${deferred.title}”`,
    )
    expect(
      within(screen.getByRole('list', { name: /completed tasks/i, hidden: true })).getByText(deferred.title),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^undo$/i }))

    expect(
      within(screen.getByRole('list', { name: /deferred tasks/i })).getByText(deferred.title),
    ).toBeInTheDocument()
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').tasks.find(
        (task: { id: string }) => task.id === deferred.id,
      ),
    ).toEqual(deferred)
  })

  it('offers undo after Mark done on the next action', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task title/i), 'Read the GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /mark done/i }))
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(/completed “read the gc note”/i)

    await user.click(screen.getByRole('button', { name: /^undo$/i }))
    expect(within(screen.getByRole('list', { name: /open tasks/i })).getByText('Read the GC note')).toBeInTheDocument()
  })

  it('undoes a deleted task with Ctrl+Z and moves focus to the queue heading', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task title/i), 'Read the GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.click(screen.getByRole('button', { name: /delete read the gc note/i }))

    expect(screen.getByRole('heading', { name: /task queue/i })).toHaveFocus()

    await user.keyboard('{Control>}z{/Control}')
    expect(screen.getByRole('button', { name: /delete read the gc note/i })).toBeInTheDocument()
  })

  it('does not hijack Ctrl+Z while typing in a field', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task title/i), 'Read the GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.click(screen.getByRole('button', { name: /delete read the gc note/i }))

    await user.click(screen.getByLabelText(/task title/i))
    await user.keyboard('{Control>}z{/Control}')

    expect(screen.queryByRole('button', { name: /delete read the gc note/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^undo$/i })).toBeInTheDocument()
  })

  it('edits a queued task inline', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^task title$/i), 'Read GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit read gc note/i }))
    const title = screen.getByRole('textbox', { name: /edit task title/i })
    expect(title).toHaveFocus()

    await user.clear(title)
    await user.type(title, 'Read GC pacer note{Enter}')

    expect(screen.getByRole('heading', { name: 'Read GC pacer note' })).toBeInTheDocument()
    expect(screen.queryByRole('form', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit read gc pacer note/i })).toHaveFocus()
  })

  it('cancels an edit with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^task title$/i), 'Read GC note')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit read gc note/i }))
    const title = screen.getByRole('textbox', { name: /edit task title/i })
    await user.clear(title)
    await user.type(title, 'Something else{Escape}')

    expect(screen.getByRole('heading', { name: 'Read GC note' })).toBeInTheDocument()
    expect(screen.queryByText('Something else')).not.toBeInTheDocument()
    expect(screen.queryByRole('form', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit read gc note/i })).toHaveFocus()
  })

  it('discards changes when Cancel is clicked', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)

    const edit = screen.getByRole('button', { name: /edit review clickhouse merge trees/i })
    await user.click(edit)
    const title = screen.getByRole('textbox', { name: /edit task title/i })
    await user.clear(title)
    await user.type(title, 'Discarded title')
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    const row = screen.getByText('Review ClickHouse merge trees').closest('li')
    expect(row).not.toBeNull()
    expect(within(row as HTMLElement).getByText('45 min')).toBeInTheDocument()
    expect(screen.queryByText('Discarded title')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit review clickhouse merge trees/i })).toHaveFocus()
  })

  it('clears topic and minutes on save and keeps the task deferred', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /edit review clickhouse merge trees/i }))
    await user.clear(screen.getByRole('spinbutton', { name: /edit minutes/i }))
    await user.selectOptions(screen.getByRole('combobox', { name: /edit topic/i }), '')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    const row = within(screen.getByRole('list', { name: /deferred tasks/i }))
      .getByText('Review ClickHouse merge trees')
      .closest('li') as HTMLElement
    expect(row).not.toHaveTextContent(/45 min/)
    expect(row.querySelector('.tag')).toBeNull()
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').tasks.find(
        (task: { id: string }) => task.id === 'task-deferred',
      ),
    ).toEqual({
      id: 'task-deferred',
      title: 'Review ClickHouse merge trees',
      status: 'deferred',
      createdAt: '2026-11-17T09:00:00.000Z',
    })
  })

  it('hides the complete button while a row is being edited', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('button', { name: /complete read the go scheduler notes/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /edit read the go scheduler notes/i }))
    expect(screen.queryByRole('button', { name: /complete read the go scheduler notes/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(screen.getByRole('button', { name: /complete read the go scheduler notes/i })).toBeInTheDocument()
  })

  it('cancels an edit with Escape without dismissing an active toast', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /delete review clickhouse merge trees/i }))
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(/deleted/i)

    await user.click(screen.getByRole('button', { name: /edit read the go scheduler notes/i }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('form', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(/deleted/i)
    expect(screen.getByRole('button', { name: /^undo$/i })).toBeInTheDocument()
  })

  it('offers no Edit button on completed tasks', () => {
    seedLearningState()
    render(<App />)

    expect(screen.getByRole('button', { name: /edit read the go scheduler notes/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /edit finish the go channels lab/i, hidden: true })).not.toBeInTheDocument()
  })
})
