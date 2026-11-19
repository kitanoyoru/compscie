import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
    sessionStorage.clear()
    document.title = ''
    window.location.hash = '#/leetcode'
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('filters by language with icon chips and toggles the filter off again', async () => {
    const user = userEvent.setup()
    render(<App />)

    const languages = screen.getByRole('group', { name: 'Language' })
    const goCount = problems.filter((problem) => problem.languages.some((language) => language === 'Go')).length
    const go = within(languages).getByRole('button', { name: `Go, ${goCount} problems` })

    // Most-used language first, right after "All".
    expect(within(languages).getAllByRole('button').map((button) => button.getAttribute('aria-label'))[1]).toBe(
      `Go, ${goCount} problems`,
    )
    expect(within(languages).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(go)

    expect(go).toHaveAttribute('aria-pressed', 'true')
    expect(window.location.hash).toContain('language=Go')
    expect(screen.getByText(matchCount(goCount))).toBeInTheDocument()

    await user.click(go)

    expect(go).toHaveAttribute('aria-pressed', 'false')
    expect(window.location.hash).not.toContain('language=')
    expect(screen.getByText(matchCount(problems.length))).toBeInTheDocument()
  })

  it('names each row with its solution languages and shows them as icons', () => {
    render(<App />)

    const twoSum = problems.find((problem) => problem.id === 1)!
    const name = new RegExp(`^two sum, problem 1,.*solutions in ${twoSum.languages.join(', ')}$`, 'i')
    const row = screen.getByRole('button', { name })

    expect(row.querySelectorAll('.lang-icon')).toHaveLength(Math.min(5, twoSum.languages.length))
  })

  it('links every solution file of the selected problem', () => {
    window.location.hash = '#/leetcode?problem=1'
    render(<App />)

    const twoSum = problems.find((problem) => problem.id === 1)!
    const links = within(screen.getByRole('list', { name: 'Solutions' })).getAllByRole('link')

    expect(links).toHaveLength(twoSum.solutions.length)
    expect(links[0]).toHaveAccessibleName(
      `${twoSum.solutions[0]!.language} solution, ${twoSum.solutions[0]!.file.split('/').at(-1)} (opens in a new tab)`,
    )
    expect(links[0]).toHaveAttribute('href', expect.stringContaining(encodeURIComponent('0001. Two Sum')))
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

  it('keeps a running timer and draft reflection across remounts', async () => {
    const user = userEvent.setup()
    const problem = problems[0]!
    window.location.hash = `#/leetcode?problem=${problem.id}`
    const first = render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    await user.type(screen.getByLabelText(/^reflection$/i), 'Hash map of complements')
    first.unmount()
    render(<App />)

    expect(screen.getByLabelText(/^reflection$/i)).toHaveValue('Hash map of complements')
    expect(screen.getByRole('button', { name: /reset timer/i })).toBeInTheDocument()
  })

  it('keeps a reflection draft but drops the timer on reset', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    const first = render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    await user.type(screen.getByLabelText(/^reflection$/i), 'Keep me')
    await user.click(screen.getByRole('button', { name: /reset timer/i }))
    first.unmount()
    render(<App />)

    expect(screen.getByLabelText(/^reflection$/i)).toHaveValue('Keep me')
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
  })

  it('saves with Ctrl+Enter and clears the draft', async () => {
    const user = userEvent.setup()
    const problem = problems[0]!
    window.location.hash = `#/leetcode?problem=${problem.id}`
    const first = render(<App />)

    await user.type(screen.getByLabelText(/^reflection$/i), 'Complement lookup')
    await user.keyboard('{Control>}{Enter}{/Control}')

    expect(screen.getByText(/session saved/i)).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: /session history/i })).getByText('Complement lookup'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/^reflection$/i)).toHaveValue('')

    first.unmount()
    render(<App />)

    expect(screen.getByLabelText(/^reflection$/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
  })

  it('does not save with Ctrl+Enter while the reflection is empty', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    await user.click(screen.getByLabelText(/^reflection$/i))
    await user.keyboard('{Control>}{Enter}{/Control}')

    expect(screen.queryByText(/session saved/i)).not.toBeInTheDocument()
  })

  it('shows the elapsed time in the tab title while the timer runs', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    expect(document.title).toBe('LeetCode · Compscie')

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    expect(document.title).toMatch(/^\d\d:\d\d · #\d+ · Compscie$/)

    await user.click(screen.getByRole('button', { name: /reset timer/i }))
    expect(document.title).toBe('LeetCode · Compscie')
  })

  it('restores the page title when a running timer unmounts', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    const view = render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    expect(document.title).toMatch(/^\d\d:\d\d · #\d+ · Compscie$/)
    view.unmount()

    expect(document.title).toBe('LeetCode · Compscie')
  })

  it('advances the title each second', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    const before = document.title

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100)
    })

    expect(document.title).toMatch(/^\d\d:\d\d · #\d+ · Compscie$/)
    expect(document.title).not.toBe(before)
  })

  it('resumes the title on the next tick after a running timer is restored', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    const first = render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    first.unmount()
    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100)
    })

    expect(document.title).toMatch(/^\d\d:\d\d · #\d+ · Compscie$/)
  })

  it('hands the title to the next page on route change', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    await user.click(screen.getByRole('link', { name: /today/i }))

    expect(document.title).toBe('Today · Compscie')
  })

  it('stops the title timer when another problem is selected', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    await user.click(screen.getByRole('button', { name: /start timer/i }))
    await user.click(screen.getByRole('button', { name: /^add two numbers, problem 2,/i }))

    expect(document.title).toBe('LeetCode · Compscie')
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
  })

  it('keeps a non-default outcome across remounts', async () => {
    const user = userEvent.setup()
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    const first = render(<App />)

    await user.click(screen.getByRole('radio', { name: /needs review/i }))
    first.unmount()
    render(<App />)

    expect(screen.getByRole('radio', { name: /needs review/i })).toBeChecked()
  })

  it('describes the save shortcut on the reflection field', () => {
    window.location.hash = `#/leetcode?problem=${problems[0]!.id}`
    render(<App />)

    expect(screen.getByLabelText(/^reflection$/i)).toHaveAccessibleDescription(/press ⌘ or ctrl \+ enter to save/i)
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
  it('restores the search from the URL', () => {
    window.location.hash = '#/leetcode?q=two%20sum'
    render(<App />)
    expect(screen.getByRole('searchbox', { name: /search problems/i })).toHaveValue('two sum')
  })

  it('focuses search with / and clears it with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('/')
    const search = screen.getByRole('searchbox', { name: /search problems/i })
    expect(search).toHaveFocus()

    await user.type(search, 'two')
    expect(search).toHaveValue('two')
    expect(window.location.hash).toContain('q=two')

    await user.keyboard('{Escape}')
    expect(search).toHaveValue('')
    expect(window.location.hash).not.toContain('q=')
  })

  it('selects the existing search text when / refocuses it', async () => {
    window.location.hash = '#/leetcode?q=two%20sum'
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('/')
    const search = screen.getByRole<HTMLInputElement>('searchbox', { name: /search problems/i })
    expect(search).toHaveFocus()
    expect(search.selectionStart).toBe(0)
    expect(search.selectionEnd).toBe('two sum'.length)
  })

  it('does not steal / while typing a reflection', async () => {
    const user = userEvent.setup()
    render(<App />)
    const reflection = screen.getByLabelText(/^reflection$/i)
    await user.type(reflection, 'a/b')
    expect(reflection).toHaveValue('a/b')
    expect(screen.getByRole('searchbox', { name: /search problems/i })).toHaveValue('')
  })

  it('clears the search along with the other filters', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByRole('searchbox', { name: /search problems/i })
    await user.type(search, 'two')
    await user.click(
      within(screen.getByRole('group', { name: 'Difficulty' })).getByRole('button', { name: /easy/i }),
    )
    expect(window.location.hash).toContain('q=two')
    expect(window.location.hash).toContain('difficulty=easy')

    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(search).toHaveValue('')
    expect(window.location.hash).not.toContain('q=')
    expect(window.location.hash).not.toContain('difficulty=')
  })

  it('leaves Escape alone when the search is empty', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByRole('searchbox', { name: /search problems/i })
    await user.click(search)
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    search.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('marks the / hint as decorative and advertises the shortcut', () => {
    render(<App />)
    const search = screen.getByRole('searchbox', { name: /search problems/i })
    expect(search).toHaveAttribute('aria-keyshortcuts', '/')
    const hint = search.parentElement?.querySelector('kbd')
    expect(hint).toHaveTextContent('/')
    expect(hint).toHaveAttribute('aria-hidden', 'true')
  })

  it('inserts mid-string without losing characters', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByRole('searchbox', { name: /search problems/i })
    await user.type(search, 'tsum')
    await user.type(search, 'wo', { initialSelectionStart: 1, initialSelectionEnd: 1 })
    expect(search).toHaveValue('twosum')
    await user.type(search, '{ArrowLeft}{ArrowLeft}{ArrowLeft}-')
    expect(search).toHaveValue('two-sum')
    expect(window.location.hash).toContain('q=two-sum')
  })

  it('ignores Escape during IME composition', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByRole('searchbox', { name: /search problems/i })
    await user.type(search, 'two')
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
      isComposing: true,
    })
    search.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(search).toHaveValue('two')
    expect(window.location.hash).toContain('q=two')
  })

  it('does not take / while a dialog is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    const dialog = document.createElement('dialog')
    dialog.setAttribute('open', '')
    document.body.append(dialog)

    try {
      await user.keyboard('/')
      expect(screen.getByRole('searchbox', { name: /search problems/i })).not.toHaveFocus()
    } finally {
      dialog.remove()
    }
  })

  it('round-trips special characters through the URL', () => {
    window.location.hash = '#/leetcode?q=c%2B%2B%20%26%20a%2Fb'
    render(<App />)
    expect(screen.getByRole('searchbox', { name: /search problems/i })).toHaveValue('c++ & a/b')
  })
})
