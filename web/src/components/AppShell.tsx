import type { JSX, PropsWithChildren } from 'react'
import { NavLink } from 'react-router'

import { repositorySnapshot } from '../data/generated/repository'
import { REPOSITORY_URL } from '../data/links'
import { formatDay } from '../lib/format'
import { useLearningDispatch } from '../state/learning-state'
import { useTheme } from '../state/theme'
import { Icon, type IconName } from './Icon'
import { RouteFocus } from './RouteEffects'
import { ExternalLink } from './ui'

const NAVIGATION: readonly { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Today', icon: 'target', end: true },
  { to: '/map', label: 'Knowledge Map', icon: 'map' },
  { to: '/leetcode', label: 'LeetCode', icon: 'code' },
]

function ThemeToggle(): JSX.Element {
  const [theme, toggle] = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

function focusMain(): void {
  document.getElementById('app-main')?.focus()
}

export function AppShell({ children }: PropsWithChildren): JSX.Element {
  const dispatch = useLearningDispatch()

  function resetWorkingState(): void {
    const confirmed = window.confirm('Reset all tasks and practice sessions stored in this browser?')

    if (confirmed) {
      dispatch({ type: 'stateReset' })
    }
  }

  return (
    <div className="shell">
      <RouteFocus />
      <button type="button" className="skip-link" onClick={focusMain}>
        Skip to content
      </button>
      <header className="app-header" aria-label="Compscie learning workspace">
        <div className="app-header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="32" height="32">
                <rect width="32" height="32" rx="9" className="brand-mark-bg" />
                <path d="M13 10.5 8 16l5 5.5M19 10.5l5 5.5-5 5.5" className="brand-mark-glyph" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">Compscie</span>
              <span className="brand-tagline">Learning workspace</span>
            </span>
          </div>
          <nav className="app-nav" aria-label="Primary">
            {NAVIGATION.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main" id="app-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <p>
            Notes and solved problems come from the repository snapshot of{' '}
            {formatDay(repositorySnapshot.generatedAt)}. Tasks and practice sessions stay in this
            browser only.
          </p>
          <div className="app-footer-actions">
            <ExternalLink href={REPOSITORY_URL} className="text-link">
              Repository
            </ExternalLink>
            <button type="button" className="button button-danger-quiet" onClick={resetWorkingState}>
              <Icon name="trash" size={14} />
              Reset working state
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
