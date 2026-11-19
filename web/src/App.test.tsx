import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'

import { App } from './App'
import { THEME_STORAGE_KEY } from './state/theme'

afterEach(() => {
  window.location.hash = ''
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

it('names the document after the page and focuses its heading on navigation', async () => {
  const user = userEvent.setup()
  window.location.hash = '#/'
  render(<App />)
  expect(document.title).toBe('Today · Compscie')

  await user.click(screen.getByRole('link', { name: /knowledge map/i }))

  expect(document.title).toBe('Knowledge Map · Compscie')
  expect(screen.getByRole('heading', { level: 1, name: /your learning landscape/i })).toHaveFocus()
})

it('keeps focus in place when only LeetCode filters change', async () => {
  const user = userEvent.setup()
  window.location.hash = '#/leetcode'
  render(<App />)
  const hard = within(screen.getByRole('group', { name: 'Difficulty' })).getByRole('button', { name: /hard/i })

  await user.click(hard)

  expect(hard).toHaveFocus()
})

it('shows a not-found page for unknown routes', () => {
  window.location.hash = '#/nope'
  render(<App />)

  expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /back to today/i })).toHaveAttribute('href', '#/')
  expect(document.title).toBe('Page not found · Compscie')
})
