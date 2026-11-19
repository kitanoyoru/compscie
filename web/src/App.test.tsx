import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'

import { App } from './App'
import { THEME_STORAGE_KEY } from './state/theme'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

it('renders the Compscie learning workspace', () => {
  render(<App />)

  expect(screen.getByRole('banner', { name: /compscie/i })).toBeInTheDocument()
})

it('switches and remembers the color theme', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))

  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

  await user.click(screen.getByRole('button', { name: /switch to light theme/i }))

  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
})
