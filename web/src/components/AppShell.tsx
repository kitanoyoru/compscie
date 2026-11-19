import type { JSX, PropsWithChildren } from 'react'
import { NavLink } from 'react-router'

export function AppShell({ children }: PropsWithChildren): JSX.Element {
  return (
    <>
      <header className="app-header" aria-label="Compscie learning workspace">
        <div className="app-brand">
          <p className="app-kicker">Personal learning platform</p>
          <h1>Compscie</h1>
        </div>
        <nav className="app-nav" aria-label="Primary">
          <NavLink to="/" end>
            Today
          </NavLink>
          <NavLink to="/map">Knowledge Map</NavLink>
          <NavLink to="/leetcode">LeetCode</NavLink>
        </nav>
      </header>
      <main className="app-main" id="app-main">
        {children}
      </main>
    </>
  )
}
