import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { App } from '../App'
import { repositorySnapshot } from '../data/generated/repository'
import { formatDay, formatTime } from '../lib/format'
import { STORAGE_KEY } from '../state/storage'
import { seedLearningState, seededState } from '../test/fixtures'

const { problems } = repositorySnapshot

function matchCount(count: number): RegExp {
  return new RegExp(`^${count.toLocaleString()} of ${problems.length.toLocaleString()} match$`)
}

describe('LeetCode workspace', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/leetcode'
  })

  it('filters solved problems by difficulty and search', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(matchCount(problems.length))).toBeInTheDocument()

    await user.click(
      within(screen.getByRole('group', { name: 'Difficulty' })).getByRole('button', { name: /hard/i }),
    )

    const hard = problems.filter((problem) => problem.difficulty === 'hard')
    expect(screen.getByText(matchCount(hard.length))).toBeInTheDocument()
    expect(window.location.hash).toContain('difficulty=hard')

    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    await user.type(screen.getByRole('searchbox', { name: /search problems/i }), 'two sum')

    const twoSums = problems.filter((problem) => problem.title.toLowerCase().includes('two sum'))
    expect(screen.getByText(matchCount(twoSums.length))).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: /matching problems/i })).getAllByRole('button'),
    ).toHaveLength(twoSums.length)
  })

  it('records a timed session with a reflection and surfaces it for review', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^add two numbers, problem 2,/i }))

    expect(screen.getByRole('heading', { name: /add two numbers/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open on leetcode/i })).toHaveAttribute(
      'href',
      'https://leetcode.com/problems/add-two-numbers/',
    )

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    await user.click(screen.getByRole('radio', { name: /needs review/i }))
    await user.type(screen.getByRole('textbox', { name: 'Reflection' }), 'Carry the remainder past the last node.')
    await user.click(screen.getByRole('button', { name: /save session/i }))

    expect(screen.getByText(/session saved/i)).toBeInTheDocument()
    expect(screen.getAllByText('Carry the remainder past the last node.')).toHaveLength(2)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      sessions: [{ problemId: 2, outcome: 'needs-review', reflection: 'Carry the remainder past the last node.' }],
    })

    await user.click(screen.getByRole('link', { name: /today/i }))

    const review = screen.getByRole('region', { name: /due for review/i })
    expect(within(review).getByRole('link', { name: /add two numbers/i })).toHaveAttribute(
      'href',
      '#/leetcode?problem=2',
    )
  })

  it('opens a deep link with a filter and a selected problem', () => {
    window.location.hash = '#/leetcode?tag=Array&problem=1'
    render(<App />)

    expect(screen.getByRole('heading', { name: /two sum/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByLabelText('Pattern')).toHaveValue('Array')
    expect(screen.getByRole('button', { name: /back to suggestion/i })).toBeInTheDocument()
  })

  it('deletes a session from history and undoes it', async () => {
    const [first] = problems
    const seeded = seededState().sessions.find((session) => session.problemId === first?.id)

    if (first === undefined || seeded === undefined) {
      throw new Error('fixtures need a session for the first problem')
    }

    seedLearningState()
    window.location.hash = `#/leetcode?problem=${first.id}`
    const user = userEvent.setup()
    render(<App />)

    const history = () => within(screen.getByRole('list', { name: /session history/i }))
    const name = `Delete session from ${formatDay(seeded.endedAt)} at ${formatTime(seeded.endedAt)}`
    expect(history().getByText(seeded.reflection ?? '')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name }))

    expect(screen.queryByRole('list', { name: /session history/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(
      `Removed a session for #${first.id}`,
    )

    await user.click(screen.getByRole('button', { name: /^undo$/i }))

    expect(history().getByText(seeded.reflection ?? '')).toBeInTheDocument()
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  })

  it('gives same-day sessions distinct delete names and removes only the chosen one', async () => {
    const [first] = problems

    if (first === undefined) {
      throw new Error('snapshot needs a problem')
    }

    const base = { problemId: first.id, outcome: 'success', startedAt: '2026-11-19T17:00:00.000Z' } as const
    seedLearningState({
      version: 1,
      tasks: [],
      sessions: [
        { ...base, endedAt: '2026-11-19T17:30:00.000Z', reflection: 'Morning attempt' },
        { ...base, endedAt: '2026-11-19T19:45:00.000Z', reflection: 'Afternoon attempt' },
      ],
    })
    window.location.hash = `#/leetcode?problem=${first.id}`
    const user = userEvent.setup()
    render(<App />)

    const buttons = screen.getAllByRole('button', { name: /^delete session from/i })
    const names = buttons.map((button) => button.getAttribute('aria-label'))
    expect(new Set(names).size).toBe(2)

    await user.click(buttons[0] as HTMLElement)

    const history = within(screen.getByRole('list', { name: /session history/i }))
    expect(history.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: /your history/i })).toHaveFocus()
  })
})
