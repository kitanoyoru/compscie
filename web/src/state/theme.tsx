import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type PropsWithChildren,
} from 'react'

export type Theme = 'light' | 'dark'
export type ThemePreference = 'system' | Theme

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

export interface ThemeApi {
  readonly preference: ThemePreference
  readonly effective: Theme
  readonly setPreference: (preference: ThemePreference) => void
  readonly toggle: () => void
}

const ThemeContext = createContext<ThemeApi | null>(null)

/**
 * Owns the color theme for the whole app so every control stays in sync. An
 * explicit choice is stored and stamped on `<html data-theme>`; "system" means
 * the key is absent and the page follows the operating system.
 */
export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
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

  const setPreference = useCallback((preference: ThemePreference) => {
    setStored(preference === 'system' ? null : preference)

    try {
      if (preference === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY)
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, preference)
      }
    } catch {
      // The choice still applies for this tab.
    }
  }, [])

  const toggle = useCallback(
    () => setPreference(effective === 'dark' ? 'light' : 'dark'),
    [effective, setPreference],
  )

  const value = useMemo<ThemeApi>(
    () => ({ preference: stored ?? 'system', effective, setPreference, toggle }),
    [stored, effective, setPreference, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeApi {
  const theme = useContext(ThemeContext)

  if (theme === null) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return theme
}
