import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../App'
import { createBackup } from '../state/backup'
import { STORAGE_KEY } from '../state/storage'
import { THEME_STORAGE_KEY } from '../state/theme'
import { seedLearningState, seededState } from '../test/fixtures'

function storedState(): { tasks: unknown[]; sessions: unknown[] } {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { tasks: unknown[]; sessions: unknown[] }
}

async function openSettings(user: ReturnType<typeof userEvent.setup>): Promise<HTMLElement> {
  await user.click(screen.getByRole('button', { name: /^settings$/i }))

  return screen.getByRole('dialog', { name: /settings/i })
}

beforeEach(() => {
  localStorage.clear()
  window.location.hash = '#/'
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
})

describe('SettingsDialog', () => {
  it('switches back to the system theme', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)

    expect(within(dialog).getByRole('radio', { name: /dark/i })).toBeChecked()
    await user.click(within(dialog).getByRole('radio', { name: /system/i }))

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('keeps the header toggle and the dialog radios in sync', async () => {
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)

    await user.click(within(dialog).getByRole('radio', { name: /dark/i }))
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^close$/i }))
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }))
    await openSettings(user)

    expect(within(screen.getByRole('dialog', { name: /settings/i })).getByRole('radio', { name: /light/i })).toBeChecked()
  })

  it('shows live counts', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)

    expect(within(dialog).getByText('3 tasks · 2 practice sessions')).toBeInTheDocument()
  })

  it('imports a backup only after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)
    const file = new File([createBackup(seededState(), new Date())], 'backup.json', { type: 'application/json' })

    await user.upload(within(dialog).getByLabelText(/import backup/i), file)
    expect(
      await within(dialog).findByText(/replace 0 tasks and 0 sessions with 3 tasks and 2 sessions/i),
    ).toBeInTheDocument()
    expect(storedState().tasks).toHaveLength(0)

    await user.click(within(dialog).getByRole('button', { name: /replace my data/i }))

    expect(storedState().tasks).toHaveLength(3)
    expect(storedState().sessions).toHaveLength(2)
    expect(screen.getByText('Backup restored')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: /replace my data/i })).not.toBeInTheDocument()
  })

  it('cancels an import without changing state', async () => {
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)
    const file = new File([createBackup(seededState(), new Date())], 'backup.json', { type: 'application/json' })

    await user.upload(within(dialog).getByLabelText(/import backup/i), file)
    await user.click(await within(dialog).findByRole('button', { name: /^cancel$/i }))

    expect(storedState().tasks).toHaveLength(0)
    expect(within(dialog).queryByRole('button', { name: /replace my data/i })).not.toBeInTheDocument()
  })

  it('shows an error for a foreign file and keeps state', async () => {
    seedLearningState()
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)
    const file = new File(['{"app":"x"}'], 'other.json', { type: 'application/json' })

    await user.upload(within(dialog).getByLabelText(/import backup/i), file)

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('This file is not a Compscie learning backup.')
    expect(within(dialog).queryByRole('button', { name: /replace my data/i })).not.toBeInTheDocument()
    expect(storedState().tasks).toHaveLength(3)
  })

  it('resets only after the in-dialog confirmation', async () => {
    seedLearningState()
    const confirm = vi.spyOn(window, 'confirm')
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)

    await user.click(within(dialog).getByRole('button', { name: /reset working state/i }))
    expect(storedState().tasks).toHaveLength(3)

    await user.click(within(dialog).getByRole('button', { name: /^cancel$/i }))
    expect(within(dialog).queryByRole('button', { name: /yes, delete everything/i })).not.toBeInTheDocument()
    expect(storedState().tasks).toHaveLength(3)

    await user.click(within(dialog).getByRole('button', { name: /reset working state/i }))
    await user.click(within(dialog).getByRole('button', { name: /yes, delete everything/i }))

    expect(storedState()).toMatchObject({ tasks: [], sessions: [] })
    expect(within(dialog).queryByRole('button', { name: /yes, delete everything/i })).not.toBeInTheDocument()
    expect(confirm).not.toHaveBeenCalled()
  })

  it('exports a backup file named after the local day', async () => {
    const createObjectURL = vi.fn(() => 'blob:backup')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL }))
    let downloaded: string | null = null
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloaded = this.getAttribute('download')
    })
    const user = userEvent.setup()
    render(<App />)
    const dialog = await openSettings(user)

    await user.click(within(dialog).getByRole('button', { name: /export backup/i }))

    expect(downloaded).toMatch(/^compscie-learning-\d{4}-\d{2}-\d{2}\.json$/)
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:backup')
  })

  it('closes with Escape and the dialog alone, leaving a toast alone', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Produce a toast by importing a backup, then reopen the dialog.
    let dialog = await openSettings(user)
    const file = new File([createBackup(seededState(), new Date())], 'backup.json', { type: 'application/json' })
    await user.upload(within(dialog).getByLabelText(/import backup/i), file)
    await user.click(await within(dialog).findByRole('button', { name: /replace my data/i }))
    expect(screen.getByText('Backup restored')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: /settings/i })).not.toBeInTheDocument()
    expect(screen.getByText('Backup restored')).toBeInTheDocument()

    dialog = await openSettings(user)
    expect(dialog).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: /^close$/i }))
    expect(screen.queryByRole('dialog', { name: /settings/i })).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(document.body, { key: 'Escape' })
    })
    expect(screen.queryByText('Backup restored')).not.toBeInTheDocument()
  })
})
