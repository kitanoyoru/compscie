import { useRef, useState, type JSX, type PropsWithChildren } from 'react'
import { NavLink } from 'react-router'

import { repositorySnapshot } from '../data/generated/repository'
import { REPOSITORY_URL } from '../data/links'
import { formatDay } from '../lib/format'
import { useTheme } from '../state/theme'
import { Icon, type IconName } from './Icon'
import { RouteFocus } from './RouteEffects'
import { SettingsDialog } from './SettingsDialog'
import { ExternalLink } from './ui'

const NAVIGATION: readonly { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Today', icon: 'target', end: true },
  { to: '/map', label: 'Knowledge Map', icon: 'map' },
  { to: '/leetcode', label: 'LeetCode', icon: 'code' },
]

function ThemeToggle(): JSX.Element {
  const { effective: theme, system, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  const label = `Switch to ${next} theme`

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={next === system ? `${label} (follows system)` : label}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

function focusMain(): void {
  document.getElementById('app-main')?.focus()
}

export function AppShell({ children }: PropsWithChildren): JSX.Element {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsButton = useRef<HTMLButtonElement>(null)

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
          <div className="header-actions">
            <ThemeToggle />
            <button
              ref={settingsButton}
              type="button"
              className="icon-button theme-toggle"
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              title="Settings"
              aria-haspopup="dialog"
            >
              <Icon name="settings" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-main" id="app-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <p>
            Snapshot {formatDay(repositorySnapshot.generatedAt.slice(0, 10))}
            <span className="meta-dot">Personal data stays in this browser</span>
          </p>
          <div className="app-footer-actions">
            <ExternalLink href={REPOSITORY_URL} className="text-link">
              Repository
            </ExternalLink>
          </div>
        </div>
      </footer>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false)
          settingsButton.current?.focus()
        }}
      />
    </div>
  )
}
