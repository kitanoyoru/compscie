import type { JSX } from 'react'
import { HashRouter, Route, Routes } from 'react-router'

import { AppShell } from './components/AppShell'
import { TodayPage } from './pages/TodayPage'
import { KnowledgeMapPage } from './pages/KnowledgeMapPage'
import { LeetCodePage } from './pages/LeetCodePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ToastProvider } from './components/Toast'
import { LearningProvider } from './state/learning-state'

export function App(): JSX.Element {
  return (
    <HashRouter>
      <LearningProvider>
        <ToastProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<TodayPage />} />
              <Route path="/map" element={<KnowledgeMapPage />} />
              <Route path="/leetcode" element={<LeetCodePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </ToastProvider>
      </LearningProvider>
    </HashRouter>
  )
}
