# Personal Learning Platform Design

## Intent

Turn this repository from a well-maintained record of learning into the personal web workspace the author opens to decide what to learn, understand how current topics connect, and run a focused LeetCode session. The platform must make those actions feel lighter than navigating Markdown and directories, while keeping the repository—not a hosted database—the durable source of knowledge.

The first release is for one person. It is a deployable static site, not a multi-user SaaS product.

## Goals

- Provide a calm **Today** view with one recommended learning action, a manageable task list, and visible weekly progress.
- Make notes, active topics, and LeetCode patterns visible as a connected **Knowledge Map** instead of disconnected files.
- Provide a first-class **LeetCode** workspace to choose a problem, record a solving session, and capture a short reflection.
- Derive read-only repository facts (topics, notes, solved problems, difficulties, languages, and tags) from the files already in this repository at build time.
- Persist personal working state—tasks, completed session history, and problem reflections—locally in the browser, so the static site is immediately useful without authentication or a backend.
- Be keyboard-accessible and usable on a narrow screen as well as a desktop.

## Non-goals

- User accounts, cloud synchronization, collaboration, or a server-side database.
- Writing Markdown notes or solution files back into the Git repository from the browser.
- Executing LeetCode code, submitting solutions, scraping LeetCode, or authenticating with its API.
- Full spaced-repetition scheduling, an AI tutor, a generic task-management product, or visualizing every possible relationship in the repository.
- A separate Review or Library route in this first release; the validated first slice is Today, Knowledge Map, and LeetCode.

## Constraints

- The user requested React and its ecosystem.
- The application lives in `web/` and must not disrupt the existing Markdown, Python tooling, Make targets, or repository organization flow.
- React source is TypeScript with strict compiler settings.
- The site is static-host compatible and must work beneath the repository path on GitHub Pages.
- Vite 8 requires Node.js `^20.19.0 || >=22.12.0`; the app records that engine requirement.
- The production bundle contains no credentials and makes no runtime network requests.
- Browser state is stored under a versioned `localStorage` key and can be reset from the UI.
- Generated repository data is committed so the production build has no filesystem dependency; `predev` and `prebuild` regenerate it.
- The existing `tools/organize.py` remains the authority for canonical LeetCode folders and metadata.

## Experience

The shell has a compact brand header and three main destinations:

1. **Today** (`#/`) leads with a single recommended next action. It lists a short task queue where the learner can add a task, complete it, or defer it. The recommendation favors an unfinished task; otherwise it uses the active topic's `next` field from its topic README. The view also shows the count of completed tasks within the current ISO week.
2. **Knowledge Map** (`#/map`) shows two active topic cards (initially Go and ClickHouse), each with its notes and stated next step. A simple deterministic graph groups topic-to-concept relationships from a small, explicit relationship list; it is an explanatory map, not a force-directed knowledge graph. Repository figures display notes, solved problems, and languages.
3. **LeetCode** (`#/leetcode`) provides difficulty, language, and pattern filters over every solved problem found in the repository. It proposes an eligible problem, starts a session timer, accepts a success/needs-review outcome and a short reflection, and exposes the latest reflections. A reflection is associated with a canonical problem id.

The platform is deliberately local-first: repositories seed stable learning evidence, while the learner controls mutable work through the UI. The code does not pretend that browser-only state is committed back into Git; a visible note explains this and offers a reset control.

## Data and State

`web/scripts/generate-repository-data.mjs` walks `notes/` and `leetcode/{easy,medium,hard}/`, parses topic frontmatter and the maintained `tools/leetcode-index.tsv`, and writes `web/src/data/generated/repository.ts`. It exports:

- `RepositorySnapshot` with `generatedAt`, topic summaries, note summaries, and aggregate counts.
- `SolvedProblem[]` keyed by numeric LeetCode id, including canonical title, difficulty, languages from solution file extensions, and tags from the TSV.

The client reducer owns this versioned state:

- `tasks: LearningTask[]` — manually created task title, optional topic id, estimated minutes, status, and created/completed dates.
- `sessions: SolveSession[]` — problem id, start/end timestamps, outcome, and optional reflection.

Malformed or obsolete local storage falls back to an empty version-1 state rather than preventing the site from rendering. Repository data stays immutable at runtime.

## Deterministic Recommendation Rules

- Today recommends an open task before any deferred task; within the same status it uses the earliest `createdAt` timestamp, then the task id. If neither exists, it selects the active topic with the oldest `lastNote` date, then its slug, and displays that topic's `next` text.
- The LeetCode tab is a **review workspace for already-solved problems**, because this repository only contains those problems. It ranks problems within the active filters by: latest `needs-review` outcome first; then problems without a recorded platform session; then least-recently completed session; and finally ascending problem id. Starting a session does not alter the ranking until the session is completed.
- The initial map has an explicit, reviewable relationship list: Go → Runtime, Concurrency, Memory, and Production diagnostics; ClickHouse → MergeTree storage, Sparse indexing, and Date/time queries. It will show those labels and source-topic associations only; it will not infer relationships from prose.

## Approaches Considered

1. **Static, local-first React app — selected.** Build facts from this Git repository, use browser storage for personal workflow state, and deploy as a static site. It meets the need for intuitive management without introducing hosting, authentication, or synchronization work.
2. **React frontend with a hosted API and database.** This would make cross-device state and richer task management straightforward, but creates operations, identity, privacy, and deployment decisions before the learning workflow has been validated.
3. **A browser-only dashboard with hard-coded seed data.** This is quickest to mock, but would drift from the note and LeetCode archive immediately and would undermine the repository's value as the source of truth.

The user selected the knowledge-map direction in the visual prototype and asked to make LeetCode solving a first-class tab. The selected approach preserves both: the map is the organizing center and the solving workspace is an equal destination.

## Technical Design

- **Tooling:** Vite 8, React 19, TypeScript, and React Router's `HashRouter` / `NavLink` APIs. Hash routing avoids static-host rewrite configuration and keeps routes shareable under GitHub Pages.
- **State:** a typed `useReducer` plus React context provider. A tiny `storage.ts` adapter performs versioned parse, serialize, and reset operations; persistence happens only after reducer changes.
- **Styling:** CSS modules or component-scoped CSS files using native CSS custom properties and responsive grid/flex layouts. No visual component framework is needed for the three-screen first release.
- **Tests:** Vitest with jsdom, React Testing Library, and `@testing-library/user-event`. A separate Node test verifies data generation against a fixture directory.
- **Deployment:** a GitHub Actions workflow builds `web/` and deploys `web/dist`; `vite.config.ts` uses `/compscie/` as the production base path.

## Explicit Product Calls

These are implementation defaults I made because the conversation did not settle them:

- The first release stays private-by-default through static hosting; no login screen or analytics.
- “Start solving” is a reflection and timing workflow around an external problem link, not an in-browser code editor.
- Topic relationships begin as a small curated file rather than inferred NLP links, because false links would make the map feel less trustworthy.
- Browser state is not synchronized across devices in v1; reset is preferable to an unreliable export/import workflow in the first slice.
- Recommendation ordering uses the deterministic rules above rather than guessing from recency, engagement, or an opaque score.

## Acceptance Criteria

- `yarn --cwd web dev` starts the React platform and `yarn --cwd web build` creates a deployable static bundle.
- The shell reaches Today, Knowledge Map, and LeetCode directly by hash URL and labels the active navigation item.
- Today can add, complete, and defer tasks; refreshing retains those changes; reset restores an empty personal state without changing repository facts.
- The map exposes the active Go and ClickHouse topics, their notes, and aggregate repository figures produced by the generator.
- LeetCode filters update the visible solved-problem list; starting a problem and completing a session creates a persisted reflection visible after refresh.
- The generator detects duplicate solved problem ids deterministically and fails with a helpful error rather than emitting ambiguous data.
- Component, reducer/storage, generator, accessibility-focused navigation, production build, and generated-data freshness checks all pass in CI.

## Revision 2026-11-19 — polish

Decisions made for the polish pass (plan: `docs/superpowers/plans/2026-11-19-learning-platform-polish.md`):

1. **Viewer-local calendar.** Weeks, streaks, and "today" use the viewer's local time zone. Repository dates (`YYYY-MM-DD`) stay calendar dates and never shift.
2. **Backup and restore ship.** A validated JSON export/import lives in Settings; import replaces state only after explicit confirmation. This supersedes the v1 non-goal "reset is preferable to export/import".
3. **Undo instead of confirm.** Task delete, task complete, and session delete act immediately and offer Undo in a 6-second toast. Only full reset keeps a confirmation, now inside the Settings dialog.
4. **Concept-to-note links are curated.** Explicit note paths in `map-relationships.ts`; nothing is inferred from prose.
5. **Playwright smoke tests ship.** CI runs them in a read-only `test` job that gates the Pages `deploy` job.

Shipped areas:

- **Routing:** per-route page titles, focus moves to the page heading on navigation, and unknown routes show a not-found page.
- **Time:** local-day and ISO-week helpers; repository dates are never shifted.
- **Undo:** toasts for task delete/complete and session delete; Ctrl/Cmd+Z triggers Undo while a toast shows.
- **Tasks:** inline editing of queued tasks.
- **Activity:** the weekly strip includes practice sessions.
- **LeetCode search:** stored in the URL (`?q=`); `/` focuses it and Esc clears it.
- **Practice drafts:** timer and reflection persist in `sessionStorage` per tab; the tab title shows elapsed time; Cmd/Ctrl+Enter saves.
- **Knowledge Map:** selecting a concept filters its curated notes.
- **Settings:** theme (System/Light/Dark), backup export/import (validated, 5 MB cap), and reset; the footer reset is removed.
- **Testing:** axe checks in Vitest for every route; Playwright smoke (360/390/1280 viewports, light/dark contrast, settings dialog, concept rows) via `yarn --cwd web e2e`.
