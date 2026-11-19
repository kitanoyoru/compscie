# Learning Platform Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Turn the redesigned learning workspace (PR #122) into a finished, trustworthy daily tool. Fix the remaining correctness gaps, make every destructive action reversible, keep in-progress work safe, and lock quality in with automated accessibility and viewport checks.

**Architecture:** No new runtime dependencies and no new routes beyond a not-found page. Each change is either a pure helper with unit tests (`lib/`, `domain/`, `state/`) or a small UI slice with React Testing Library coverage. Personal state keeps the `compscie.learning-platform.v1` shape; new reducer actions are additive. Transient drafts live in `sessionStorage`. Repository data stays immutable.

**Tech Stack:** Node.js 22, Yarn 1, Vite 8, React 19, React Router 7 (`HashRouter`), strict TypeScript, native CSS tokens, Vitest + jsdom + Testing Library. New dev dependencies: `axe-core` (Task 1) and optional `@playwright/test` (Task 11).

**Spec:** docs/superpowers/specs/2026-11-17-learning-platform-design.md. Task 12 appends a dated revision section that records the product calls below.

## Starting Point (verified 2026-11-19 on `main` @ 097584a)

- `yarn --cwd web test --run`: 9 files, 54 tests pass. `tsc` is clean.
- `vite build`: JS 431 kB (115 kB gzip), CSS 27 kB (6 kB gzip). The generated snapshot of 628 problems dominates the bundle. Route code-splitting would save little, so it is out of scope.
- Gaps found in a code read:
  - **Day math mixes time zones.** `getIsoWeekStart`, `utcDay`, `activityStreak`, and `daysBetween` use UTC days. `formatLongDay` uses local time. Work done on a late evening west of UTC counts toward the next day or week.
  - **Route changes are silent.** `document.title` never changes. Focus and scroll position stay where they were. An unknown hash such as `#/nope` renders an empty `<main>`.
  - **One-click data loss.** Task delete and task complete have no undo. A wrong session cannot be removed except by a full reset. Reset uses `window.confirm` and sits in the footer of every page.
  - **Fragile in-progress work.** The session timer and reflection draft live in component state. Navigating away or reloading loses them.
  - **Small inconsistencies.** The week strip counts tasks only, but the streak also counts sessions. The search query is the only LeetCode filter not in the URL. Tasks cannot be edited. The theme cannot return to "follow system" after one toggle. Knowledge-map concepts do not connect to notes.
  - **No automated accessibility or viewport checks.** Mobile widths were verified by hand in PR #122.

## Global Constraints

- Keep all work in `web/`, except README/spec docs (Task 12) and the optional CI step (Task 11).
- No runtime network requests. No new runtime dependencies.
- Do not change the shape of `compscie.learning-platform.v1`. New `LearningAction` variants are fine. Old stored data must load unchanged.
- New browser keys: `compscie.session-draft.v1` in `sessionStorage` (Task 8). `compscie.theme` keeps `'light' | 'dark'`; "system" means the key is absent (Task 10).
- Every new control is keyboard reachable, has an accessible name, and respects `prefers-reduced-motion`. Pages fit 360px width with no horizontal scroll.
- Each task is test-first and ends green on `yarn --cwd web check && yarn --cwd web test --run`, followed by one commit.
- Commit style follows repository history: `feat(platform): …`, `fix(platform): …`, `test(platform): …`, `docs(platform): …`. Work on branch `feat/platform-polish`; open one PR at the end.

## Explicit Product Calls

These defaults were not settled in conversation. Change them before execution if they are wrong.

1. **Viewer-local calendar.** Weeks, streaks, and "today" use the viewer's local time zone. Repository dates (`YYYY-MM-DD`) stay calendar dates and never shift.
2. **Backup and restore now ship.** The v1 spec deferred export/import. The data now has real history, so Task 10 adds a validated JSON backup. Import replaces state only after an explicit confirmation.
3. **Undo instead of confirm.** Delete, complete, and session removal act immediately and offer Undo in a toast for 6 seconds. Only full reset keeps a confirmation step, and that step moves into the Settings dialog.
4. **Concept → note links are curated.** Task 9 adds explicit note paths to `map-relationships.ts`. Nothing is inferred from prose.
5. **Playwright is optional (Task 11).** Skip it if adding a browser download to CI is unwanted. Tasks 1–10 do not depend on it.

## Review Focus

Each risk has an owning test:

- A completion at Sunday 21:00 local time (Monday 05:00 UTC) counts in the earlier week. Owner: Task 3.
- Repository date `2026-11-17` stays Nov 17 in every time zone. Owner: Task 3.
- Undo restores the exact previous task, including `deferred` status and `completedAt`. Owner: Task 4.
- Changing a LeetCode filter or search does not move focus. Only a pathname change does. Owner: Task 2.
- A running timer and reflection draft survive unmount and remount. Saving clears the draft. Owner: Task 8.
- The `/` shortcut does nothing while focus is in an input, textarea, or select. Owner: Task 7.
- Malformed or foreign backup files show an error and leave state untouched. Owner: Task 10.
- Every curated concept note path exists in the snapshot. Owner: Task 9.
- No WCAG A/AA axe violations on any route, with empty and seeded state. Owner: Task 1, re-run by every later task.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| web/src/test/axe.ts, web/src/test/fixtures.ts, web/src/a11y.test.tsx | Shared axe assertion, seeded personal state, route-level accessibility suite. |
| web/src/components/RouteEffects.tsx, web/src/pages/NotFoundPage.tsx | Page titles, focus and scroll on route change, unknown-route page. |
| web/src/lib/calendar.ts | Viewer-local day keys, ISO week start, DST-safe day arithmetic. |
| web/src/components/Toast.tsx | Single polite toast region with optional Undo action. |
| web/src/components/TaskFields.tsx | Title/topic/minutes fields shared by the composer and the inline editor. |
| web/src/lib/keyboard.ts | `isTypingTarget` guard for global shortcuts. |
| web/src/state/session-draft.ts | Per-problem timer and reflection drafts in `sessionStorage`. |
| web/src/state/backup.ts, web/src/components/SettingsDialog.tsx | Backup format, validation, theme preference, import/export/reset UI. |
| web/e2e/, web/playwright.config.ts | Optional real-browser viewport and contrast smoke checks. |

Task order matters in three places. Task 1 comes first, because later tasks reuse its fixtures and axe helper. Task 3 comes before Tasks 6 and 10, which use `localDayKey`. Task 2 comes before Task 8, which restores the page title.

---

### Task 1: Accessibility regression harness

**Files:**

- Create: web/src/test/axe.ts, web/src/test/fixtures.ts, web/src/a11y.test.tsx
- Modify: web/package.json (dev dependency `axe-core`)

**Interfaces:**

- Produces `expectNoAxeViolations(root: Element): Promise<void>`.
- Produces `seededState(): PersonalLearningState` and `seedLearningState(state?: PersonalLearningState): void`. The seeded state has one open task, one deferred task, and one completed task, each with a topic and minutes. It also has a `needs-review` session with a reflection for `problems[0]` and a `success` session for `problems[1]`.

- [ ] **Step 1: Write the failing accessibility suite**

~~~tsx
import { render } from '@testing-library/react'
import { beforeEach, describe, it } from 'vitest'

import { App } from './App'
import { expectNoAxeViolations } from './test/axe'
import { seedLearningState } from './test/fixtures'

const ROUTES = ['#/', '#/map', '#/leetcode'] as const

describe.each(ROUTES)('accessibility of %s', (hash) => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = hash
  })

  it('has no WCAG A/AA violations with empty state', async () => {
    const { container } = render(<App />)
    await expectNoAxeViolations(container)
  })

  it('has no WCAG A/AA violations with seeded state', async () => {
    seedLearningState()
    const { container } = render(<App />)
    await expectNoAxeViolations(container)
  })
})
~~~

- [ ] **Step 2: Run it to verify it fails**

Run: `yarn --cwd web add --dev axe-core && yarn --cwd web test a11y --run`

Expected: FAIL. `./test/axe` and `./test/fixtures` do not exist.

- [ ] **Step 3: Implement the helpers**

~~~ts
// web/src/test/axe.ts
import axe from 'axe-core'
import { expect } from 'vitest'

export async function expectNoAxeViolations(root: Element): Promise<void> {
  const results = await axe.run(root, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    // jsdom computes no layout or colors. Task 11 checks contrast in a real browser.
    rules: { 'color-contrast': { enabled: false } },
  })

  expect(
    results.violations.map(
      (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    ),
  ).toEqual([])
}
~~~

`fixtures.ts` builds the state with fixed ISO timestamps in week 2026-11-16..22. `seedLearningState` writes `JSON.stringify(state)` to `STORAGE_KEY`.

- [ ] **Step 4: Fix every reported violation**

Fix each violation at its source; do not disable rules. Put a one-line cause for each fix in the commit body. If there are no violations, the suite is still the baseline that guards later tasks.

- [ ] **Step 5: Verify and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

Expected: PASS (54 + 6 tests).

~~~sh
git add web/package.json web/yarn.lock web/src/test web/src/a11y.test.tsx
git commit -m "test(platform): add axe accessibility regression checks"
~~~

### Task 2: Route titles, focus, scroll, and not-found page

**Files:**

- Create: web/src/components/RouteEffects.tsx, web/src/pages/NotFoundPage.tsx
- Modify: web/src/App.tsx, web/src/components/AppShell.tsx, web/src/components/ui.tsx, web/src/pages/TodayPage.tsx, web/src/pages/KnowledgeMapPage.tsx, web/src/pages/LeetCodePage.tsx, web/src/App.test.tsx, web/src/styles/global.css

**Interfaces:**

- `usePageTitle(title: string): void` sets `document.title` to `` `${title} · Compscie` ``. Titles: `Today`, `Knowledge Map`, `LeetCode`, `Page not found`.
- `RouteFocus(): null` is mounted once in `AppShell`. It skips the first render. On each later `pathname` change, it sets `document.documentElement.scrollTop = 0` and focuses `#app-main h1`. It ignores search-parameter changes. Do not call `window.scrollTo`, because jsdom logs "Not implemented".
- `PageHeader`'s `<h1>` gets `tabIndex={-1}`. CSS hides the outline only for `:focus:not(:focus-visible)`.
- `<Route path="*" element={<NotFoundPage />} />` renders a `PageHeader` titled "Page not found" and a `Link` "Back to Today".

- [ ] **Step 1: Write failing tests**

~~~tsx
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
~~~

Add `'#/nope'` to `ROUTES` in `a11y.test.tsx`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test App a11y --run`

Expected: FAIL on the title, focus, and not-found assertions.

- [ ] **Step 3: Implement**

Use `useLocation().pathname` plus a `useRef` first-render flag in `RouteFocus`. Call `usePageTitle` at the top of each page component. Keep the existing `focusMain` skip link.

- [ ] **Step 4: Verify and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): announce route changes and add not-found page"
~~~

### Task 3: Use the viewer's local calendar for days and weeks

**Files:**

- Create: web/src/lib/calendar.ts, web/src/lib/calendar.test.ts
- Modify: web/src/test/setup.ts, web/src/lib/format.ts, web/src/domain/insights.ts, web/src/domain/recommendations.ts, web/src/pages/today/WeekCard.tsx, web/src/domain/insights.test.ts, web/src/domain/recommendations.test.ts

**Interfaces:**

- `isCalendarDate(value: string): boolean` matches `^\d{4}-\d{2}-\d{2}$`.
- `localDayKey(value: Date | string): string | undefined` returns `YYYY-MM-DD` from local date parts. A calendar date returns unchanged. An unparsable value returns `undefined`.
- `startOfLocalIsoWeek(now: Date): Date` returns local Monday 00:00.
- `addLocalDays(date: Date, days: number): Date` uses `new Date(y, m, d + days)` and is DST safe.
- `localDaysBetween(from: Date | string, to: Date): number | undefined` diffs local day keys through `Date.UTC(y, m, d)`, so a 23-hour or 25-hour day still counts as one day.
- `getIsoWeekStart` delegates to `startOfLocalIsoWeek`. Replace `utcDay` with `localDayKey` and delete `utcDay`. `formatDay` formats calendar dates with the existing UTC formatter and timestamps with a local formatter. `daysBetween` delegates to `localDaysBetween`.

- [ ] **Step 1: Pin the test time zone and write failing tests**

Make the first line of `web/src/test/setup.ts` `process.env.TZ = 'America/Los_Angeles'`. In November this zone is PST (UTC−8). US DST ends 2026-11-01, so a DST boundary is also in range.

~~~ts
// calendar.test.ts — the suite runs in America/Los_Angeles (see src/test/setup.ts).
it('runs in the pinned test time zone', () => {
  expect(new Date('2026-11-16T05:00:00Z').getHours()).toBe(21)
})

it('keys timestamps by the viewer local day', () => {
  expect(localDayKey('2026-11-16T05:00:00Z')).toBe('2026-11-15')
})

it('keeps repository calendar dates unchanged', () => {
  expect(localDayKey('2026-11-17')).toBe('2026-11-17')
})

it('starts the ISO week at local Monday midnight', () => {
  const start = startOfLocalIsoWeek(new Date('2026-11-17T06:00:00Z')) // Monday 22:00 PST
  expect(localDayKey(start)).toBe('2026-11-16')
  expect([start.getHours(), start.getMinutes()]).toEqual([0, 0])
})

it('counts calendar days across the DST change', () => {
  expect(localDaysBetween('2026-10-31', new Date('2026-11-02T20:00:00Z'))).toBe(2)
})
~~~

~~~ts
// recommendations.test.ts
it('counts a Sunday-evening completion in the week it happened locally', () => {
  const tasks = [completedTask('late-sunday', '2026-11-16T05:00:00.000Z')] // Sunday 21:00 PST
  expect(countCompletedThisIsoWeek(tasks, new Date('2026-11-17T18:00:00Z'))).toBe(0)
})
~~~

The current UTC implementation returns 1 here, so this test discriminates.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test calendar recommendations insights --run`

Expected: FAIL. `calendar.ts` is missing, and the Sunday-evening count is 1.

- [ ] **Step 3: Implement and migrate callers**

Route all day math through `calendar.ts`. Some existing fixtures encode UTC-day expectations. Re-check each failing assertion: change the expectation only when local-day semantics explain the difference, and say which cases changed in the commit body.

- [ ] **Step 4: Verify and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "fix(platform): use the viewer's local calendar for days and weeks"
~~~

### Task 4: Undo toasts for task and session changes

**Files:**

- Create: web/src/components/Toast.tsx, web/src/components/Toast.test.tsx
- Modify: web/src/App.tsx, web/src/domain/personal-types.ts, web/src/state/learning-state.tsx, web/src/state/learning-state.test.tsx, web/src/components/TaskList.tsx, web/src/pages/today/NextActionCard.tsx, web/src/pages/leetcode/SessionPanel.tsx, web/src/pages/TodayPage.test.tsx, web/src/pages/LeetCodePage.test.tsx, web/src/styles/global.css

**Interfaces:**

- New actions:
  - `{ type: 'taskRestored'; task: LearningTask }` upserts. It replaces the task with the same id, or appends it if absent.
  - `{ type: 'sessionDeleted'; problemId: number; endedAt: string }` removes the first matching session.
- `ToastProvider` wraps `AppShell` inside `LearningProvider`. `useToast(): (toast: { message: string; action?: { label: string; onAction: () => void } }) => void`.
- The toast region is always mounted as `<div role="status" aria-live="polite" aria-label="Notifications">`. It shows one toast; a new toast replaces the old one. The toast closes after 6000 ms, waits while hovered or focused, and closes on Escape.
- Wiring:
  - Delete a task: toast `Deleted “<title>”`. Undo dispatches `taskRestored` with the snapshot from before the delete.
  - Complete a task, from the list or from Up next: toast `Completed “<title>”`. Undo dispatches `taskRestored` with the snapshot from before the completion.
  - Delete a session: a trash icon button in `SessionHistory` named `Delete session from <day>`. Toast `Removed a session for #<id>`. Undo dispatches `sessionCompleted` with the removed session.

- [ ] **Step 1: Write failing reducer and UI tests**

~~~ts
it('restores the exact previous version of a task', () => {
  const deferred: LearningTask = { ...task('a'), status: 'deferred' }
  const completed = learningReducer(
    { version: 1, tasks: [deferred], sessions: [] },
    { type: 'taskCompleted', taskId: 'a', completedAt: '2026-11-19T10:00:00.000Z' },
  )

  expect(learningReducer(completed, { type: 'taskRestored', task: deferred }).tasks).toEqual([deferred])
})

it('deletes one session by problem and end time', () => {
  const state = { version: 1, tasks: [], sessions: [session(1, 'A'), session(1, 'B')] } as const
  expect(learningReducer(state, { type: 'sessionDeleted', problemId: 1, endedAt: 'A' }).sessions).toEqual([
    session(1, 'B'),
  ])
})
~~~

~~~tsx
it('undoes a deleted task', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText(/task title/i), 'Read the GC note')
  await user.click(screen.getByRole('button', { name: /add task/i }))

  await user.click(screen.getByRole('button', { name: /delete read the gc note/i }))
  expect(screen.queryByRole('button', { name: /delete read the gc note/i })).not.toBeInTheDocument()
  expect(screen.getByRole('status', { name: /notifications/i })).toHaveTextContent(/deleted “read the gc note”/i)

  await user.click(screen.getByRole('button', { name: /^undo$/i }))
  expect(screen.getByRole('button', { name: /delete read the gc note/i })).toBeInTheDocument()
})
~~~

In `Toast.test.tsx`, cover auto-dismiss with `vi.useFakeTimers({ shouldAdvanceTime: true })` and `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`. Advance 6000 ms and assert the message is gone. Add a LeetCode test that deletes a seeded session and undoes the delete.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test learning-state Toast TodayPage LeetCodePage --run`

Expected: FAIL. The actions, provider, and buttons do not exist.

- [ ] **Step 3: Implement**

The toast uses tokens only: surface, border, and shadow. It enters with a 150 ms translate and opacity transition, which the existing reduced-motion rule disables. On narrow screens it sits bottom-center, with `bottom: max(1rem, env(safe-area-inset-bottom))`.

- [ ] **Step 4: Verify and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): add undo toasts for task and session changes"
~~~

### Task 5: Edit queued tasks inline

**Files:**

- Create: web/src/components/TaskFields.tsx
- Modify: web/src/components/TaskComposer.tsx, web/src/components/TaskList.tsx, web/src/components/Icon.tsx (`pencil`), web/src/domain/personal-types.ts, web/src/state/learning-state.tsx, web/src/state/learning-state.test.tsx, web/src/pages/TodayPage.test.tsx, web/src/styles/global.css

**Interfaces:**

- New action: `{ type: 'taskEdited'; taskId: string; title: string; topicId?: string; estimatedMinutes?: number }`. The reducer trims the title and ignores an empty one. Omitted `topicId` and `estimatedMinutes` clear those fields. Status and dates never change.
- `TaskFields` is controlled. It takes `{ title, topicId, minutes, onChange, idPrefix, labels }` and renders the three labelled fields. `TaskComposer` and the inline editor both use it. Keep the minutes validation in one helper: `parseMinutes(raw: string): number | undefined`.
- Open and deferred tasks get an Edit icon button named `Edit <title>`. Completed tasks do not. Edit mode replaces the row body with an inline form whose fields are labelled `Edit task title`, `Edit topic`, and `Edit minutes`. When the form opens, focus goes to the title field. Enter or Save submits; Escape or Cancel closes. After close, focus returns to the Edit button.

- [ ] **Step 1: Write failing tests**

~~~tsx
it('edits a queued task inline', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText(/^task title$/i), 'Read GC note')
  await user.click(screen.getByRole('button', { name: /add task/i }))

  await user.click(screen.getByRole('button', { name: /edit read gc note/i }))
  const title = screen.getByRole('textbox', { name: /edit task title/i })
  expect(title).toHaveFocus()

  await user.clear(title)
  await user.type(title, 'Read GC pacer note{Enter}')

  expect(screen.getByRole('heading', { name: 'Read GC pacer note' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /edit read gc pacer note/i })).toHaveFocus()
})

it('cancels an edit with Escape', async () => {
  // Same setup; type a new title, press {Escape}, and expect the original title with focus on Edit.
})
~~~

Add a reducer test: `taskEdited` with a whitespace-only title returns the same state object.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test TodayPage learning-state --run`

Expected: FAIL. There is no Edit button and no `taskEdited` action.

- [ ] **Step 3: Implement, verify, and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): edit queued tasks inline"
~~~

### Task 6: Show practice sessions in weekly activity

**Files:**

- Modify: web/src/domain/insights.ts, web/src/domain/insights.test.ts, web/src/components/charts.tsx, web/src/pages/today/WeekCard.tsx, web/src/pages/TodayPage.test.tsx, web/src/styles/global.css

**Interfaces:**

- `interface DayActivity { readonly date: string; readonly tasks: number; readonly sessions: number }`.
- `activityByDayThisIsoWeek(tasks, sessions, now): DayActivity[]` returns seven local days, Monday first. It replaces `completionsByDayThisIsoWeek`; delete the old function and its tests.
- `WeekStrip` draws a stacked column: tasks use `--series-1`, sessions use the new `--series-2`. Define `--series-2` in light and dark, CVD-distinct from `--series-1` against both surfaces. Show a visible legend: "Tasks", "Practice". The list is labelled `Activity this week`. Each day's screen-reader text reads `Tue: 1 task, 1 practice session`. The hero figure stays "tasks completed".

- [ ] **Step 1: Write failing tests**

~~~ts
it('counts tasks and practice sessions per local day', () => {
  const days = activityByDayThisIsoWeek(
    [completedTask('a', '2026-11-17T18:00:00.000Z')],
    [session(1, '2026-11-17T20:00:00.000Z')],
    new Date('2026-11-19T18:00:00.000Z'),
  )

  expect(days).toHaveLength(7)
  expect(days[1]).toEqual({ date: '2026-11-17', tasks: 1, sessions: 1 })
})
~~~

~~~tsx
it('lists practice sessions in the weekly activity strip', () => {
  seedLearningState()
  render(<App />)
  expect(screen.getByRole('list', { name: /activity this week/i })).toHaveTextContent(/practice session/i)
})
~~~

Pin the seeded session timestamps inside the current week with `vi.setSystemTime`. Otherwise this test depends on the real date.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test insights TodayPage --run`

Expected: FAIL. The function and label do not exist.

- [ ] **Step 3: Implement, verify, and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): show practice sessions in weekly activity"
~~~

### Task 7: Shareable problem search and keyboard shortcuts

**Files:**

- Create: web/src/lib/keyboard.ts, web/src/lib/keyboard.test.ts
- Modify: web/src/pages/leetcode/useLeetCodeParams.ts, web/src/pages/LeetCodePage.tsx, web/src/pages/leetcode/ProblemBrowser.tsx, web/src/pages/LeetCodePage.test.tsx, web/src/styles/global.css

**Interfaces:**

- `LeetCodeParamKey` gains `'q'`. `LeetCodeParams` gains `query: string`. `LeetCodePage` drops its local `useState` query. `clearFilters` also clears `q`.
- `isTypingTarget(target: EventTarget | null): boolean` is true for `input`, `textarea`, `select`, and `[contenteditable]`.
- `ProblemBrowser` registers a `keydown` listener on `document`. When the key is `/`, no modifier is held, and `isTypingTarget` is false, it prevents the default and focuses the search box. Escape inside the search box clears `q`. Show a `<kbd>/</kbd>` hint inside the search field; hide it with `aria-hidden` and show it only at ≥ 40rem.

- [ ] **Step 1: Write failing tests**

~~~tsx
it('restores the search from the URL', () => {
  window.location.hash = '#/leetcode?q=two%20sum'
  render(<App />)
  expect(screen.getByRole('searchbox', { name: /search problems/i })).toHaveValue('two sum')
})

it('focuses search with / and clears it with Escape', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.keyboard('/')
  const search = screen.getByRole('searchbox', { name: /search problems/i })
  expect(search).toHaveFocus()

  await user.type(search, 'two')
  expect(window.location.hash).toContain('q=two')

  await user.keyboard('{Escape}')
  expect(search).toHaveValue('')
  expect(window.location.hash).not.toContain('q=')
})

it('does not steal / while typing a reflection', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText(/reflection/i), 'a/b')
  expect(screen.getByLabelText(/reflection/i)).toHaveValue('a/b')
})
~~~

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test LeetCodePage keyboard --run`

Expected: FAIL.

- [ ] **Step 3: Implement, verify, and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): shareable problem search and keyboard shortcuts"
~~~

### Task 8: Keep practice drafts across navigation

**Files:**

- Create: web/src/state/session-draft.ts, web/src/state/session-draft.test.ts
- Modify: web/src/pages/leetcode/SessionPanel.tsx, web/src/pages/LeetCodePage.test.tsx

**Interfaces:**

- `SESSION_DRAFT_KEY = 'compscie.session-draft.v1'` in `sessionStorage`. The value maps problem id to a draft.
- `interface SessionDraft { problemId: number; startedAt: number | null; outcome: SolveOutcome; reflection: string }`.
- `loadSessionDraft(problemId: number): SessionDraft | undefined`, `saveSessionDraft(draft: SessionDraft): void`, `clearSessionDraft(problemId: number): void`. Malformed storage reads as empty. Every storage access is wrapped in try/catch, as in `storage.ts`.
- `SessionRecorder` initializes from the draft. After each change, it saves the draft when the timer runs or the reflection is non-empty, and clears it otherwise. It clears the draft after a successful save.
- While the timer runs, `document.title` is `` `${elapsed} · #${id} · Compscie` ``. When the timer stops or the component unmounts, restore the title that was current before the timer started (Task 2's page title).
- Cmd+Enter or Ctrl+Enter inside the reflection submits when the reflection is non-empty.

- [ ] **Step 1: Write failing tests**

~~~tsx
it('keeps a running timer and draft reflection across remounts', async () => {
  const user = userEvent.setup()
  const problem = problems[0]!
  window.location.hash = `#/leetcode?problem=${problem.id}`
  const first = render(<App />)

  await user.click(screen.getByRole('button', { name: /start timer/i }))
  await user.type(screen.getByLabelText(/reflection/i), 'Hash map of complements')
  first.unmount()
  render(<App />)

  expect(screen.getByLabelText(/reflection/i)).toHaveValue('Hash map of complements')
  expect(screen.getByRole('button', { name: /reset timer/i })).toBeInTheDocument()
})

it('saves with Ctrl+Enter and clears the draft', async () => {
  // Type a reflection, press {Control>}{Enter}{/Control}, expect "Session saved" in the panel status,
  // then remount and expect an empty reflection.
})
~~~

`session-draft.test.ts` covers the round trip, malformed JSON, and the per-problem clear. Clear `sessionStorage` in `beforeEach`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test session-draft LeetCodePage --run`

Expected: FAIL.

- [ ] **Step 3: Implement, verify, and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): keep practice drafts across navigation"
~~~

### Task 9: Link knowledge-map concepts to their notes

**Files:**

- Create: web/src/data/map-relationships.test.ts
- Modify: web/src/data/map-relationships.ts, web/src/pages/map/TopicCard.tsx, web/src/pages/KnowledgeMapPage.test.tsx, web/src/styles/global.css

**Interfaces:**

- `interface TopicRelationship { readonly topic: string; readonly concept: string; readonly notes: readonly string[] }`. The note values are repository paths. Keep exactly the seven existing concepts.
- Proposed curation. The author reviews it before merge.

| Concept | Notes (`notes/<topic>/…`) |
| --- | --- |
| Runtime | scheduler-gmp.md, timers-tickers.md, defer.md, deadlock-detector.md |
| Concurrency | channels.md, mutex.md, rwmutex.md, waitgroup.md, context.md, context-package-internals.md, memory-model.md |
| Memory | memory-allocator.md, garbage-collector.md, escape-analysis-gc-tuning.md, slices.md, maps-legacy-buckets.md, maps-swiss-tables.md |
| Production diagnostics | deadlock-detector.md, escape-analysis-gc-tuning.md, garbage-collector.md |
| MergeTree storage | data-part.md, granule.md, primary-key-vs-order-by.md |
| Sparse indexing | sparse-index.md, granule.md, primary-key-vs-order-by.md |
| Date/time queries | date-time-functions.md |

  `go/interfaces.md` and `go/generics.md` stay unmapped. They appear under "All notes".
- In `ConceptFan`, each concept becomes a `<button aria-pressed>`. Selecting a concept filters the topic's note list. The list label changes from `Notes` to `Notes about <concept>`, and a "Show all notes" text button appears. Pressing the active concept again clears the filter. The SVG connectors stay decorative.

- [ ] **Step 1: Write failing tests**

~~~ts
it('links every curated concept to notes that exist in the snapshot', () => {
  const paths = repositorySnapshot.notes.map((note) => note.path)

  for (const relationship of mapRelationships) {
    expect(relationship.notes.length, relationship.concept).toBeGreaterThan(0)
    for (const note of relationship.notes) {
      expect(paths, `${relationship.concept}: ${note}`).toContain(note)
    }
  }
})
~~~

~~~tsx
it('filters a topic’s notes by concept', async () => {
  const user = userEvent.setup()
  window.location.hash = '#/map'
  render(<App />)
  const go = screen.getByRole('article', { name: 'Go' })

  await user.click(within(go).getByRole('button', { name: 'Concurrency' }))

  const hrefs = within(within(go).getByRole('list', { name: /notes about concurrency/i }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href') ?? '')
  expect(hrefs.some((href) => href.endsWith('notes/go/channels.md'))).toBe(true)
  expect(hrefs.some((href) => href.endsWith('notes/go/garbage-collector.md'))).toBe(false)
})
~~~

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test map-relationships KnowledgeMapPage --run`

Expected: FAIL. There is no `notes` field and no concept buttons.

- [ ] **Step 3: Implement, verify, and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): link knowledge-map concepts to their notes"
~~~

### Task 10: Settings dialog with theme preference, backup, and reset

**Files:**

- Create: web/src/state/backup.ts, web/src/state/backup.test.ts, web/src/components/SettingsDialog.tsx, web/src/components/SettingsDialog.test.tsx
- Modify: web/src/state/storage.ts, web/src/state/theme.ts, web/src/domain/personal-types.ts, web/src/state/learning-state.tsx, web/src/components/AppShell.tsx, web/src/components/Icon.tsx (`settings`, `download`, `upload`), web/src/test/setup.ts, web/src/App.test.tsx, web/src/styles/global.css

**Interfaces:**

- `storage.ts`: extract `parsePersonalState(value: unknown): PersonalLearningState | null`. `loadPersonalState` calls it.
- New action: `{ type: 'stateReplaced'; state: PersonalLearningState }`.
- `backup.ts`:
  - `BACKUP_APP_ID = 'compscie-learning-platform'`.
  - `createBackup(state, now: Date): string` returns pretty JSON `{ app, version: 1, exportedAt, state }`.
  - `backupFilename(now: Date): string` returns `compscie-learning-<localDayKey>.json`.
  - `readBackup(text: string): { ok: true; state: PersonalLearningState } | { ok: false; error: string }`. The three errors are exactly: `This file is not valid JSON.`, `This file is not a Compscie learning backup.`, and `This backup’s tasks or sessions are malformed.`
- `theme.ts`: `type ThemePreference = 'system' | 'light' | 'dark'`. `useTheme(): { preference; effective; setPreference; toggle }`. Setting `'system'` removes `compscie.theme`. The `index.html` pre-paint script stays unchanged.
- `AppShell`: add a header icon button named `Settings`, next to the existing theme toggle, which stays. Remove the footer reset button. Keep the footer text.
- `SettingsDialog` is a native `<dialog>` opened with `showModal()` and labelled by its "Settings" heading. It has three sections:
  1. **Appearance:** a radio group `Theme` with options System, Light, and Dark.
  2. **Your data:** live counts (`N tasks · M practice sessions`), an Export backup button, and an Import backup file input that accepts `.json,application/json`. A valid import shows `Replace N tasks and M sessions with X tasks and Y sessions?` with "Replace my data" and "Cancel". An invalid import shows the error in `role="alert"` and changes nothing.
  3. **Reset:** "Reset working state" reveals an inline confirmation, "Yes, delete everything". There is no `window.confirm`.
  
  Escape and the Close button close the dialog. Native `<dialog>` returns focus to the opener.
- `setup.ts` polyfill: jsdom may lack `showModal`. If it does, `showModal` sets `open = true`, and `close` sets `open = false` and dispatches `close`.

- [ ] **Step 1: Write failing tests**

~~~ts
// backup.test.ts
it('round-trips a backup', () => {
  const state = seededState()
  expect(readBackup(createBackup(state, new Date('2026-11-19T18:00:00Z')))).toEqual({ ok: true, state })
})

it.each([
  ['{', /not valid json/i],
  [JSON.stringify({ app: 'other', version: 1, state: seededState() }), /not a compscie learning backup/i],
  [JSON.stringify({ app: BACKUP_APP_ID, version: 1, state: { version: 1, tasks: [{}], sessions: [] } }), /malformed/i],
])('rejects %s', (text, error) => {
  expect(readBackup(text)).toEqual({ ok: false, error: expect.stringMatching(error) })
})

it('names the file after the local day', () => {
  expect(backupFilename(new Date('2026-11-20T05:00:00Z'))).toBe('compscie-learning-2026-11-19.json')
})
~~~

~~~tsx
// SettingsDialog.test.tsx
it('switches back to the system theme', async () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'dark')
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /^settings$/i }))
  const dialog = screen.getByRole('dialog', { name: /settings/i })
  await user.click(within(dialog).getByRole('radio', { name: /system/i }))

  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  expect(document.documentElement.dataset.theme).toBeUndefined()
})

it('imports a backup only after confirmation', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: /^settings$/i }))
  const dialog = screen.getByRole('dialog', { name: /settings/i })
  const file = new File([createBackup(seededState(), new Date())], 'backup.json', { type: 'application/json' })

  await user.upload(within(dialog).getByLabelText(/import backup/i), file)
  expect(within(dialog).getByText(/replace 0 tasks and 0 sessions with 3 tasks and 2 sessions/i)).toBeInTheDocument()
  await user.click(within(dialog).getByRole('button', { name: /replace my data/i }))

  expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').tasks).toHaveLength(3)
})

it('shows an error for a foreign file and keeps state', async () => { /* upload '{"app":"x"}' → role=alert */ })
it('resets only after the in-dialog confirmation', async () => { /* seed, click reset, then confirm */ })
it('exports a backup file', async () => {
  /* stub URL.createObjectURL/revokeObjectURL and HTMLAnchorElement.prototype.click;
     assert the anchor's download attribute matches /^compscie-learning-\d{4}-\d{2}-\d{2}\.json$/ */
})
~~~

Add the open dialog to the a11y suite: one case opens Settings on `#/` and runs `expectNoAxeViolations(document.body)`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn --cwd web test backup SettingsDialog App a11y --run`

Expected: FAIL.

- [ ] **Step 3: Implement**

Export with `new Blob([text], { type: 'application/json' })`, `URL.createObjectURL`, and a temporary `<a download>`. Revoke the URL afterwards. Read the import with `await file.text()`. The dialog's width is `min(32rem, 100vw - 2rem)`. Style `::backdrop` with tokens, and verify it at 360px.

- [ ] **Step 4: Verify and commit**

Run: `yarn --cwd web check && yarn --cwd web test --run`

~~~sh
git add web/src
git commit -m "feat(platform): add settings with theme preference, backup, and reset"
~~~

### Task 11 (optional): Real-browser viewport and contrast smoke

**Files:**

- Create: web/playwright.config.ts, web/e2e/smoke.spec.ts
- Modify: web/package.json (dev dependency `@playwright/test`, script `"e2e": "playwright test"`), .gitignore (`web/test-results/`, `web/playwright-report/`), .github/workflows/learning-platform.yml

**Interfaces:**

- The Playwright `webServer` runs `yarn build && yarn preview --port 4173 --strictPort` with `url: 'http://localhost:4173/compscie/'` and `reuseExistingServer: !process.env.CI`. Use Chromium only.
- The smoke test runs for each of `#/`, `#/map`, `#/leetcode` at widths 360, 390, and 1280. It asserts that the `h1` is visible and that `document.documentElement.scrollWidth - innerWidth <= 0`. On `#/` and `#/leetcode`, it also injects `axe-core` (resolved with `createRequire(import.meta.url).resolve('axe-core')`), runs only `color-contrast`, and expects zero violations under `page.emulateMedia({ colorScheme: 'light' })` and under `'dark'`.

- [ ] **Step 1: Write the smoke spec**

~~~ts
import { expect, test } from '@playwright/test'

const ROUTES = ['#/', '#/map', '#/leetcode'] as const

for (const width of [360, 390, 1280]) {
  for (const route of ROUTES) {
    test(`${route} fits ${width}px without horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`/compscie/${route}`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
}
~~~

- [ ] **Step 2: Run it**

Run: `yarn --cwd web add --dev @playwright/test && npx --prefix web playwright install chromium && yarn --cwd web e2e`

Expected: PASS. If a width or contrast failure appears, fix it in CSS tokens or layout. Do not loosen the assertion.

- [ ] **Step 3: Add to CI after `yarn --cwd web build`**

~~~yaml
      - run: npx --prefix web playwright install --with-deps chromium
      - run: yarn --cwd web e2e
~~~

- [ ] **Step 4: Commit**

~~~sh
git add .gitignore .github/workflows/learning-platform.yml web/package.json web/yarn.lock web/playwright.config.ts web/e2e
git commit -m "test(platform): add browser viewport and contrast smoke tests"
~~~

### Task 12: Documentation and release verification

**Files:**

- Modify: README.md (platform section), docs/superpowers/specs/2026-11-17-learning-platform-design.md

**Interfaces:**

- README: Settings (theme, backup/restore, reset), the `/` and `Esc` shortcuts, Cmd/Ctrl+Enter to save a session, "days and weeks follow your local time zone", and drafts that survive navigation in the same tab.
- Spec: append `## Revision 2026-11-19 — polish`. List the five Explicit Product Calls above. It supersedes the v1 non-goal "reset is preferable to export/import".

- [ ] **Step 1: Run the full gate**

Run:

~~~sh
yarn --cwd web generate:data && git diff --exit-code -- web/src/data/generated/repository.ts \
  && yarn --cwd web check && yarn --cwd web test --run && yarn --cwd web build
~~~

If Task 11 shipped, also run `yarn --cwd web e2e`.

Expected: every command exits 0. JS gzip stays within +10 kB of the 115 kB baseline.

- [ ] **Step 2: Do the manual pass and record it in the PR description**

- Keyboard only: skip link, all routes, add/edit/complete/undo a task, `/` search, start and save a session with Ctrl+Enter, open Settings, then Esc.
- VoiceOver spot check: the route change announces the new `h1`, and the toast is spoken once.
- Check 360px, dark mode, and `prefers-reduced-motion: reduce` (no toast slide).
- Reload while the timer runs: the draft is restored.

- [ ] **Step 3: Commit and open the PR**

~~~sh
git add README.md docs/superpowers/specs/2026-11-17-learning-platform-design.md
git commit -m "docs(platform): document workspace polish"
git push -u origin feat/platform-polish
gh pr create --title "feat(platform): polish learning workspace" --body-file <prepared description>
~~~

## Out of Scope

- PWA/offline install, cross-device sync, accounts.
- Spaced-repetition scheduling or changes to the LeetCode ranking rules.
- Command palette and route-level code-splitting. The bundle is dominated by the snapshot, so splitting gains little.
- Editing or deleting reflections in place. Deleting and re-recording a session (Task 4) covers mistakes.

## Self-Review

- **Gap coverage:** time zones (Task 3); silent routes and 404 (Task 2); one-click loss and footer reset (Tasks 4 and 10); lost drafts (Task 8); week-strip, search, edit, theme, and concept inconsistencies (Tasks 5, 6, 7, 9, and 10); missing automated checks (Tasks 1 and 11).
- **Step scan:** every task starts with a concrete failing test that names the module, gives an exact run command and expected failure, and ends in one reviewable commit.
- **Type consistency:** new actions (`taskRestored`, `sessionDeleted`, `taskEdited`, `stateReplaced`) are additive to `LearningAction`. The persisted v1 shape is unchanged. `localDayKey` (Task 3) is the only day-key helper that Tasks 6 and 10 consume.
- **Review focus:** every listed risk names its owning task and test.
- **Proportion:** the plan fixes interfaces, copy, keys, and tests. Component bodies are left to the implementer, following the 2026-11-17 plan.
