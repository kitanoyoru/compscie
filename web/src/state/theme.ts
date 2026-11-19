import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'compscie.theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)

    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches
    ? 'dark'
    : 'light'
}

/**
 * The effective color theme. An explicit choice is stored and stamped on
 * `<html data-theme>`; without one the page follows the operating system.
 */
export function useTheme(): readonly [Theme, () => void] {
  const [stored, setStored] = useState<Theme | null>(readStoredTheme)
  const [system, setSystem] = useState<Theme>(systemTheme)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined
    }

    const query = window.matchMedia(DARK_QUERY)
    const listener = () => setSystem(query.matches ? 'dark' : 'light')

    query.addEventListener('change', listener)

    return () => query.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    if (stored === null) {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = stored
    }
  }, [stored])

  const effective = stored ?? system

  const toggle = useCallback(() => {
    const next: Theme = effective === 'dark' ? 'light' : 'dark'

    setStored(next)

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // The choice still applies for this tab.
    }
  }, [effective])

  return [effective, toggle] as const
}
