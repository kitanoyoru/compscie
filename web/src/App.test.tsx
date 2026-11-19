import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { App } from './App'
import { repositorySnapshot } from './data/generated/repository'
import { formatDay } from './lib/format'
import { THEME_STORAGE_KEY } from './state/theme'

beforeEach(() => {
  window.location.hash = ''
})

afterEach(() => {
  document.title = ''
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

it('renders the Compscie learning workspace', () => {
  render(<App />)

  expect(screen.getByRole('banner', { name: /compscie/i })).toBeInTheDocument()
})

it('shows the snapshot date as its calendar day in the footer', () => {
  render(<App />)

  const day = repositorySnapshot.generatedAt.slice(0, 10)

  expect(screen.getByRole('contentinfo')).toHaveTextContent(`Snapshot ${formatDay(day)}`)
})

// jsdom has no matchMedia, so the operating system theme reads as light in these tests.
it('stores a theme that differs from the system and forgets one that matches it', async () => {
  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute(
    'title',
    'Switch to dark theme',
  )
  await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))

  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  expect(screen.getByRole('button', { name: /switch to light theme/i })).toHaveAttribute(
    'title',
    'Switch to light theme (follows system)',
  )

  await user.click(screen.getByRole('button', { name: /switch to light theme/i }))

  expect(document.documentElement.dataset.theme).toBeUndefined()
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
})

it('returns to following the system from a stored theme that matches it', async () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'light')
  const user = userEvent.setup()
  render(<App />)

  expect(document.documentElement.dataset.theme).toBe('light')
  await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  await user.click(screen.getByRole('button', { name: /switch to light theme/i }))

  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  expect(document.documentElement.dataset.theme).toBeUndefined()
})

it('names the document after the page and focuses its heading on navigation', async () => {
  const user = userEvent.setup()
  window.location.hash = '#/'
  render(<App />)
  expect(document.title).toBe('Today · Compscie')

  await user.click(screen.getByRole('link', { name: /knowledge map/i }))

  expect(document.title).toBe('Knowledge Map · Compscie')
  expect(screen.getByRole('heading', { level: 1, name: 'Knowledge Map' })).toHaveFocus()

  await user.click(screen.getByRole('link', { name: /^leetcode$/i }))

  expect(document.title).toBe('LeetCode · Compscie')
  expect(screen.getByRole('heading', { level: 1, name: 'LeetCode' })).toHaveFocus()
})

it('does not steal focus on first load', () => {
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  expect(document.body).toHaveFocus()
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
