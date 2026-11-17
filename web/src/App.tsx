import type { JSX } from 'react'
import { HashRouter, Route, Routes } from 'react-router'

import { AppShell } from './components/AppShell'
import { TodayPage } from './pages/TodayPage'
import { LearningProvider } from './state/learning-state'

export function App(): JSX.Element {
  return (
    <HashRouter>
      <LearningProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route
              path="/map"
              element={
                <section aria-labelledby="map-heading">
                  <h2 id="map-heading">Knowledge Map</h2>
                  <p>The explicit knowledge map is coming next.</p>
                </section>
              }
            />
            <Route
              path="/leetcode"
              element={
                <section aria-labelledby="leetcode-heading">
                  <h2 id="leetcode-heading">LeetCode</h2>
                  <p>The review workflow is coming next.</p>
                </section>
              }
            />
          </Routes>
        </AppShell>
      </LearningProvider>
    </HashRouter>
  )
}
