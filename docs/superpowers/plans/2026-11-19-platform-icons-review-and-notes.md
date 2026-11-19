# Learning Platform: Language Icons, Polish, Review Loop, and Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make the workspace look finished and close the learning loop. Show programming languages as brand-colored icons instead of text, tighten the layout, remove hand-maintained data, and add five features: a spaced review schedule, an in-app solution viewer, an in-app note reader, a self-quiz built from note questions, and a command palette.

**Architecture:** Still a local-first React app with no runtime dependencies beyond React and React Router. Heavy content (rendered notes, highlighted solutions) is produced at build time by `generate:data` into a gitignored folder and loaded lazily with `import.meta.glob`, so the main bundle does not grow with content. The committed snapshot (`web/src/data/generated/repository.ts`) gains small metadata fields only. Personal state keeps `compscie.learning-platform.v1`; the only change is one additive optional field (`cardReviews`, Task 18).

**Tech Stack:** Node.js 22, Yarn 1, Vite 8, React 19, React Router 8 (`HashRouter`), TypeScript 7, native CSS tokens, Vitest + jsdom + Testing Library, axe-core, Playwright. New **dev** dependencies only: `simple-icons` (icon vendoring script), `shiki` (build-time highlighting), `markdown-it` + `@types/markdown-it` (build-time note rendering), `github-slugger` (GitHub-compatible heading ids).

**Spec:** docs/superpowers/specs/2026-11-17-learning-platform-design.md. Task 21 appends a dated revision section with the decisions below.

## Decisions (2026-11-19)

| Question             | Decision                                                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Icon color           | Brand colors. Base values are GitHub linguist colors (already used by the README chart), adjusted per theme to reach 3:1 contrast against card surfaces. |
| Dependencies         | Dev dependencies are fine. Runtime dependencies stay at React and React Router.                                                                          |
| Features in scope    | Review schedule, solution viewer, note reader, note self-quiz, command palette.                                                                          |
| Out of scope         | Activity heatmap, extra problem sort/filters, weak-pattern insight, accounts, sync, any network calls beyond same-origin chunks.                         |
| Theme control        | Keep the header toggle. Remove the theme fieldset from Settings. See Task 10 for how "follow system" stays reachable.                                    |
| Task "Minutes" field | Unchanged. No decision was made, so it stays.                                                                                                            |

## Starting Point (verified 2026-11-19 on `main` @ fea03e6)

- `vitest --run`: 20 files, 220 tests pass.
- `web/dist`: JS 451 kB, CSS 31 kB (one chunk each). The 628-problem snapshot dominates.
- Languages render as text in five places: problem rows (`ProblemBrowser.tsx:245`), the session panel (`SessionPanel.tsx:72`), the language `<select>` filter, the Knowledge Map languages `BarList` plus the "Languages" stat tile, and `docs/leetcode-languages.svg` (written by `tools/organize.py`, called from `tools/notes.py sync`).
- Language names and extensions are duplicated: `LANGUAGE_NAMES` in `web/scripts/repository-data.mjs` and `LANG_NAMES` in `tools/organize.py`. Colors exist only in `organize.py` (`LANG_COLORS`).
- `web/src/data/map-relationships.ts` hand-lists note paths for 7 concepts across 2 topics. Its test pins those paths.
- The review queue (`reviewQueue` in `domain/insights.ts`) lists only problems whose latest session is "needs review". Solved problems never come back.
- Notes link out to GitHub. `HashRouter` owns the URL hash, so plain `#section` anchors cannot work inside the app.
- The session column is already sticky at 64rem and wider. Problem rows are two lines tall (about 70 px), so 40 rows make the LeetCode page about 3,300 px tall.
- Theme is controlled in two places: the header toggle and a System/Light/Dark fieldset in `SettingsDialog`.
- Notes follow `notes/_template/note.md`: a `## Questions this answers` bullet list, then `## Notes`. Code fences: go, sql, text, sh, and one `mermaid` block (`notes/go/mutex.md`). No raw HTML in any note.
- **Data bug:** `leetcode/medium/0973. K Closest Points to Origin/` contains a nested folder `429. N-ary Tree Level Order Traversal/main.py`. The generator counts that file as a second Python solution for 973.

## Global Constraints

- Keep work inside `web/`, except `tools/languages.json` and `tools/organize.py` (Tasks 1 and 6), note frontmatter (Task 11), the misfiled folder (Task 3), and docs (Task 21).
- No new runtime dependencies. Check `package.json` `dependencies` is unchanged at the end of every PR.
- `web/src/data/generated/repository.ts` stays committed, and the CI freshness check stays. New generated content goes to `web/src/data/generated/content/`, which is gitignored and written by `generate:data` (`predev`, `prebuild`).
- Unit tests must not depend on generated content. Content loaders live in one module (`web/src/data/content.ts`) that tests mock with `vi.mock`.
- Never emit raw `#id` links in rendered content. In-app section links use `?section=<id>` (Task 16).
- Every new route goes into the `ROUTES` list in `src/a11y.test.tsx` and the route list in `e2e/smoke.spec.ts` (both color schemes). Every new modal or interactive surface gets an axe test.
- HTML from Shiki and markdown-it is generated at build time from files in this repository and is the only content rendered with `dangerouslySetInnerHTML`. markdown-it runs with `html: false`.
- Bundle budget: the main JS chunk may grow by at most 25 kB gzip across this whole plan. Record before/after sizes in each PR description.
- One commit per task, Conventional Commits as in recent history, for example `feat(platform): show language icons in problem rows`.

## Delivery

| PR  | Tasks | Theme                                  |
| --- | ----- | -------------------------------------- |
| 1   | 1–6   | Language icons                         |
| 2   | 7–10  | Visual polish and single theme control |
| 3   | 11    | Concepts from frontmatter              |
| 4   | 12–13 | Review schedule and Review page        |
| 5   | 14–15 | Solution viewer                        |
| 6   | 16–18 | Note reader and self-quiz              |
| 7   | 19–20 | Command palette                        |
| 7   | 21    | Docs                                   |

Order matters: the self-quiz reuses the review scheduler (Task 12) and the note renderer (Task 16), and the palette indexes note routes (Task 17).

## File Map

New:

- `tools/languages.json`: one registry for language names, extensions, linguist colors, Shiki ids, and icon slugs.
- `web/scripts/vendor-language-icons.mjs`: writes `web/src/data/language-icons.json` from `simple-icons` and the registry.
- `web/src/data/language-icons.json` (committed), `web/src/data/LANGUAGE_ICONS_LICENSE.md`.
- `web/src/components/LanguageIcon.tsx`: `LanguageIcon`, `LanguageIconList`.
- `web/src/lib/contrast.ts`: relative luminance and contrast ratio.
- `web/scripts/content/solutions.mjs`, `web/scripts/content/notes.mjs`, `web/scripts/content/highlighter.mjs`.
- `web/src/data/content.ts`: lazy loaders for generated content.
- `web/src/domain/review-schedule.ts`, `web/src/domain/quiz.ts`, `web/src/domain/search.ts`.
- `web/src/pages/ReviewPage.tsx`, `web/src/pages/review/*`.
- `web/src/pages/NotePage.tsx`, `web/src/components/NoteContent.tsx`, `web/src/components/CodeBlock.tsx`.
- `web/src/pages/leetcode/SolutionViewer.tsx`.
- `web/src/components/CommandPalette.tsx`.

Changed: `repository-data.mjs`, `generate-repository-data.mjs`, `data/types.ts`, `ProblemBrowser.tsx`, `SessionPanel.tsx`, `KnowledgeMapPage.tsx`, `TopicCard.tsx`, `charts.tsx`, `ui.tsx`, `AppShell.tsx`, `App.tsx`, `Icon.tsx`, `SettingsDialog.tsx`, `state/theme.tsx`, `state/storage.ts`, `state/backup.ts`, `state/learning-state.tsx`, `domain/personal-types.ts`, `domain/recommendations.ts`, `pages/today/*`, `styles/global.css`, `.gitignore`, `tools/organize.py`.

Deleted: `web/src/data/map-relationships.ts` and its test, `StatTile` (if unused after Task 9), the LeetCode-page placement of `RecentReflections`.

---

## Phase A: Language Icons (PR 1)

### Task 1: Shared language registry

**Files:** `tools/languages.json` (new), `web/scripts/repository-data.mjs`, `tools/organize.py`, `web/scripts/repository-data.test.mjs`

- [ ] Create `tools/languages.json` with every language currently in `LANGUAGE_NAMES` (25 entries). Shape:

```json
{
  "languages": [
    {
      "name": "Go",
      "extensions": [".go"],
      "color": "#00ADD8",
      "shiki": "go",
      "icon": "go"
    },
    {
      "name": "Elixir",
      "extensions": [".ex", ".exs"],
      "color": "#6E4A7E",
      "shiki": "elixir",
      "icon": "elixir"
    },
    {
      "name": "SQL",
      "extensions": [".sql"],
      "color": "#E38C00",
      "shiki": "sql",
      "icon": null
    }
  ]
}
```

`color` comes from `LANG_COLORS` in `organize.py`. `icon` is a simple-icons slug, or `null` when the vendoring script supplies a glyph (Task 2).

- [ ] In `repository-data.mjs`, replace `LANGUAGE_NAMES` with a map built from the registry. Read it from `new URL('../../tools/languages.json', import.meta.url)`, **not** from `repoRoot`: the test fixtures pass their own root and have no `tools/languages.json`.
- [ ] In `organize.py`, build `LANG_NAMES` and `LANG_COLORS` from the same file (`json.loads(Path(__file__).with_name("languages.json").read_text())`). Keep `LANG_COLOR_FALLBACK`.
- [ ] Test: in `repository-data.test.mjs`, check that every extension appears once across the registry.
- [ ] Verify: run `python3 tools/notes.py sync`. `git diff --exit-code README.md leetcode/README.md docs/leetcode-languages.svg` must be clean. Run `yarn --cwd web run generate:data`; `repository.ts` must be unchanged.
- [ ] Commit: `refactor(platform): share one language registry between the web app and tools`.

### Task 2: Vendor icon paths and theme-safe colors

**Files:** `web/scripts/vendor-language-icons.mjs` (new), `web/src/data/language-icons.json` (new, committed), `web/src/data/LANGUAGE_ICONS_LICENSE.md` (new), `web/package.json`

- [ ] `yarn --cwd web add -D simple-icons`. Add script `"vendor:icons": "node scripts/vendor-language-icons.mjs"`.
- [ ] The script reads the registry and imports `* as icons from 'simple-icons'`. For each slug it looks up `icons['si' + PascalCase(slug)]` and writes `{ path, viewBox: '0 0 24 24', source }`.
- [ ] Gaps:
  - **Java:** check for a Java or OpenJDK export (`siOpenjdk`). If neither fits, copy the devicon "java-plain" path by hand (MIT), set `source: "devicon"` and its own `viewBox`, and record the MIT notice in `LANGUAGE_ICONS_LICENSE.md`.
  - **SQL:** no brand mark. Use a stroke-style database glyph (cylinder) drawn in the 24×24 grid, `source: "local"`.
  - **Shell:** `siGnubash`.
  - Languages in the registry but not in the repository (Haskell, PHP, and so on) may stay without an icon. The component falls back to a monogram (Task 4).
- [ ] Colors: for each language compute `light` and `dark` variants from `color`. Darken (light theme) or lighten (dark theme) in HSL lightness steps of 2% until contrast is ≥ 3:1 against **every** background the icon can sit on:
  - Light theme: `--surface #fcfcfb`, `--surface-sunken #f1f1ed`, `--surface-hover #efefea`.
  - Dark theme: `--surface #1a1a19`, `--surface-sunken #161615`, `--surface-hover #232321`.

  Keep the original value when it already passes. Several linguist colors fail on light surfaces as-is (JavaScript `#F1E05A`, Shell `#89E051`, Rust `#DEA584`, Go `#00ADD8`), so this step is required.

- [ ] Output shape: `{ "Go": { "path": "…", "viewBox": "0 0 24 24", "source": "simple-icons", "light": "#…", "dark": "#…" } }`, keys sorted.
- [ ] `LANGUAGE_ICONS_LICENSE.md`: simple-icons is CC0 (no notice required, credit given anyway). Add the devicon MIT notice if used. Brand marks remain trademarks of their owners and are used here only to identify languages.
- [ ] Commit: `feat(platform): vendor language icons with theme-safe brand colors`.

### Task 3: Solution files in the snapshot

**Files:** `web/scripts/repository-data.mjs`, `web/src/data/types.ts`, fixtures under `web/scripts/fixtures/`, `web/scripts/repository-data.test.mjs`, `leetcode/medium/0973. K Closest Points to Origin/`

- [ ] Fix the data bug first. Check whether a `0429` folder already exists under `leetcode/`. If it does, compare the files and delete the nested copy. If it does not, move the nested folder to `leetcode/medium/0429. N-ary Tree Level Order Traversal/` (check difficulty in `tools/leetcode-index.tsv`) and make sure 429 is in the index.
- [ ] Guard: `collectLanguages` throws when a problem folder contains a subfolder whose name matches `/^\s*\d{1,4}\./` ("nested problem folder"). Add a fixture under `scripts/fixtures/nested/` and a test for it.
- [ ] Add `solutions` to each problem:

```ts
export interface SolutionFile {
  readonly language: string
  /** Repository-relative path, e.g. `leetcode/easy/0001. Two Sum/main.go`. */
  readonly file: string
}

export interface SolvedProblem {
  // …existing fields
  readonly solutions: readonly SolutionFile[]
}
```

Sort by language, then path. Keep `languages` (derived, unique) so filters do not change.

- [ ] Update the valid fixture expectations. Regenerate `repository.ts`. Expect about +1,600 lines.
- [ ] Commit: `feat(platform): list solution files per problem and reject nested problem folders`.

### Task 4: `LanguageIcon` component and contrast tests

**Files:** `web/src/components/LanguageIcon.tsx`, `web/src/lib/contrast.ts`, `web/src/lib/contrast.test.ts`, `web/src/components/LanguageIcon.test.tsx`, `web/src/styles/global.css`

- [ ] `lib/contrast.ts`: `relativeLuminance(hex)`, `contrastRatio(a, b)` per WCAG 2.x.
- [ ] Component API:

```tsx
interface LanguageIconProps {
  readonly language: string
  readonly size?: number // default 16
  /** When true the icon is aria-hidden and the parent supplies the name. Default false. */
  readonly decorative?: boolean
}

interface LanguageIconListProps {
  readonly languages: readonly string[]
  readonly max?: number // default 5; extra ones become "+N"
  readonly decorative?: boolean
}
```

Non-decorative icons render `role="img"` with `aria-label={language}`. All icons render `title={language}` for a hover tooltip. The SVG is `aria-hidden` with `fill="currentColor"`. Colors arrive as CSS custom properties: `style={{ '--lang-light': light, '--lang-dark': dark }}`. An unknown language renders a two-letter monogram in `--ink-muted`.

- [ ] CSS, mirroring the existing theme selectors:

```css
.lang-icon {
  color: var(--lang-light, var(--ink-muted));
  display: inline-flex;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .lang-icon {
    color: var(--lang-dark, var(--ink-muted));
  }
}
:root[data-theme="dark"] .lang-icon {
  color: var(--lang-dark, var(--ink-muted));
}
.lang-chip {
  /* icon in a pill */
  background: color-mix(in srgb, currentColor 12%, transparent);
}
```

- [ ] Tests:
  - Each entry in `language-icons.json` has `light` ≥ 3:1 against the three light backgrounds and `dark` ≥ 3:1 against the three dark ones (Task 2 list).
  - Every language in `repositorySnapshot.counts.languages` has an icon entry. This fails CI when a new language shows up without an icon, and points at `yarn --cwd web run vendor:icons`.
  - `LanguageIconList` with 7 languages and `max={5}` renders 5 icons and "+2", and its accessible text names all 7.
- [ ] Commit: `feat(platform): add language icon components`.

### Task 5: Replace language text with icons

**Files:** `ProblemBrowser.tsx`, `SessionPanel.tsx`, `KnowledgeMapPage.tsx`, `components/charts.tsx`, related tests, `global.css`

- [ ] **Problem rows:** replace `.problem-languages` text with `<LanguageIconList languages={problem.languages} max={5} decorative />`. Append `, solved in Go, TypeScript` to the row button's `aria-label`.
- [ ] **Language filter:** replace the `<select>` with a toggle group: `role="group" aria-label="Language"`, an "All" button first, then one icon button per language **sorted by count, highest first**. Each button: icon plus count, `aria-pressed`, accessible name `Go, 421 problems`. It keeps the same `language` URL param, so `/leetcode?language=Go` deep links still work. Buttons wrap on narrow screens.
- [ ] **Session panel:** replace "Solved in …" with one `lang-chip` link per `solutions` entry, pointing to `repositoryFileUrl(file)`, accessible name `Go solution (opens in a new tab)`. Task 15 turns these into viewer tabs.
- [ ] **Knowledge Map chart:** extend `BarListItem` with optional `icon?: ReactNode` and `color?: string`. With `icon`, the visible label is the icon only; the link keeps `aria-label={label}` and `title`. With `color`, the bar fill uses `--bar-color` (set the light and dark values the same way `.lang-icon` does). Turn the "Also: Zig (3), …" footnote into an icon list with counts.
- [ ] Update tests: `LeetCodePage.test.tsx` and `ProblemBrowser.test.tsx` switch from `selectOptions` to clicking `{ name: /^go,/i }`. `KnowledgeMapPage.test.tsx:69` (`link` named `Go`) should still pass.
- [ ] Run `make platform-test`, `make platform-e2e` (contrast in both schemes).
- [ ] Commit: `feat(platform): show languages as brand-colored icons`.

### Task 6: Icons in the README chart

**Files:** `tools/organize.py`

- [ ] In `language_chart_svg`, read `web/src/data/language-icons.json` and draw each language's path to the left of its bar: `<path transform="translate(x y) scale(s)" d="…" fill="…"/>`, with `s = 14 / viewBoxWidth`. Use the registry `color` for both bar and icon (the README image has fixed colors).
- [ ] Run `python3 tools/notes.py sync`, open `docs/leetcode-languages.svg` in a browser, and check alignment.
- [ ] This task can be dropped if PR 1 runs long; nothing depends on it.
- [ ] Commit: `feat(tools): draw language icons in the README chart`.

---

## Phase B: Visual Polish (PR 2)

### Task 7: Trim page headers and footer

**Files:** `components/ui.tsx` (`PageHeader`), `TodayPage.tsx`, `KnowledgeMapPage.tsx`, `LeetCodePage.tsx`, `AppShell.tsx`, tests that query the old headings

- [ ] Titles become plain: "Today" (keep the date line under it), "Knowledge Map", "LeetCode". Remove the taglines ("Practice that sticks", "Your learning landscape") and the description paragraphs. Drop the `description` prop from `PageHeader` if nothing uses it.
- [ ] Footer: one line, `Snapshot Nov 19 · Personal data stays in this browser · Repository ↗`.
- [ ] `grep -rn "Practice that sticks\|Your learning landscape" web/src` and update tests.
- [ ] Commit: `style(platform): replace marketing copy with plain page titles`.

### Task 8: One-line problem rows

**Files:** `global.css` (`.problem-row` and related), `ProblemBrowser.tsx`

- [ ] Grid per row: `number | title (ellipsis) | language icons | badges`, about 44 px tall. Below 48rem, icons move under the title.
- [ ] Keep `PAGE_SIZE` at 40. Do not add a nested scroll area: the session column is already sticky, and a second scroll region hurts keyboard and screen-reader use.
- [ ] Check the 375 px viewport e2e test still passes (no horizontal scroll).
- [ ] Commit: `style(platform): compact problem rows to one line`.

### Task 9: Knowledge Map summary strip and quieter empty states

**Files:** `KnowledgeMapPage.tsx`, `ui.tsx`, `pages/today/WeekCard.tsx`, `components/TaskList.tsx`, `global.css`, tests

- [ ] Replace the four `StatTile`s with one summary card: `2 active topics · 24 notes, latest Nov 19 · 628 solved` + the existing `SegmentedBar` for difficulty + top 5 language icons and "+11". Delete `StatTile` if unused.
- [ ] `WeekCard`: when the week has no activity and the streak is 0, replace the large "0 tasks completed" with one line ("No activity yet this week") above the strip.
- [ ] `TaskList` empty state: one line inside the card instead of the dashed box.
- [ ] Run e2e contrast and viewport tests in both schemes.
- [ ] Commit: `style(platform): merge map stats into one strip and quiet empty states`.

### Task 10: One theme control

**Files:** `state/theme.tsx`, `SettingsDialog.tsx`, `SettingsDialog.test.tsx`, `App.test.tsx`

- [ ] Remove the Theme fieldset and `THEME_OPTIONS` from `SettingsDialog`.
- [ ] Change `toggle` so "follow system" stays reachable without a third state. The toggle always flips the visible theme. When the new theme equals the OS theme, clear the stored choice instead of storing it:

```ts
const toggle = useCallback(() => {
  const next: Theme = effective === "dark" ? "light" : "dark"
  setPreference(next === system ? "system" : next)
}, [effective, system, setPreference])
```

Trade-off: you cannot pin the theme that matches your OS. If the OS later switches (for example at night), the app follows it. This is noted in the README (Task 21) and can be revisited.

- [ ] Button `title` adds "(follows system)" when the next theme equals the OS theme. Keep `aria-label` as `Switch to {next} theme`.
- [ ] Tests: move "switches back to the system theme" from `SettingsDialog.test.tsx` to `App.test.tsx`: with OS light, toggle to dark (key = `dark`), toggle again (key absent, no `data-theme`). The e2e helper that seeds `compscie.theme` still works.
- [ ] Commit: `refactor(platform): keep theme in the header toggle only`.

---

## Phase C: Concepts From Frontmatter (PR 3)

### Task 11: Replace `map-relationships.ts`

**Files:** topic `README.md`s and notes under `notes/`, `notes/_template/*`, `tools/notes.py` (docstring only), `web/scripts/repository-data.mjs`, `web/src/data/types.ts`, `TopicCard.tsx`, `KnowledgeMapPage.test.tsx`, delete `data/map-relationships.ts` + test

- [ ] Topic README frontmatter gets the ordered concept list, comma-separated (the generator's frontmatter parser reads single-line values):
  - `notes/go/README.md`: `concepts: Runtime, Concurrency, Memory, Production diagnostics`
  - `notes/clickhouse/README.md`: `concepts: MergeTree storage, Sparse indexing, Date/time queries`
- [ ] Note frontmatter gets `concepts:`. Migrate exactly from today's file:

| Note                                                                         | concepts                           |
| ---------------------------------------------------------------------------- | ---------------------------------- |
| go/scheduler-gmp, go/timers-tickers, go/defer                                | Runtime                            |
| go/deadlock-detector                                                         | Runtime, Production diagnostics    |
| go/channels, go/mutex, go/rwmutex, go/waitgroup, go/context, go/memory-model | Concurrency                        |
| go/memory-allocator, go/slices, go/maps-legacy-buckets, go/maps-swiss-tables | Memory                             |
| go/garbage-collector, go/escape-analysis-gc-tuning                           | Memory, Production diagnostics     |
| go/generics, go/interfaces                                                   | (none)                             |
| clickhouse/data-part, clickhouse/partitioning                                | MergeTree storage                  |
| clickhouse/granule, clickhouse/primary-key-vs-order-by                       | MergeTree storage, Sparse indexing |
| clickhouse/sparse-index                                                      | Sparse indexing                    |
| clickhouse/date-time-functions                                               | Date/time queries                  |

- [ ] Confirm `tools/notes.py` keeps unknown frontmatter keys. `stamp_date` inserts into the existing block and `sync_topic_readme` only rewrites between the note-list markers, so no code change is expected. Run `python3 tools/notes.py sync` and check `git diff` shows no frontmatter loss.
- [ ] Generator: `TopicSummary.concepts: readonly string[]`, `NoteSummary.concepts: readonly string[]`. Validation errors: a note concept that is not in its topic's list (message names the note path); a topic concept with no notes.
- [ ] `TopicCard` builds the concept fan from the snapshot. Delete `map-relationships.ts` and `map-relationships.test.ts`. `KnowledgeMapPage.test.tsx` reads the expected Concurrency notes from the snapshot.
- [ ] Mention `concepts:` in the template and in the `notes.py` module docstring.
- [ ] Commit: `refactor(platform): read knowledge-map concepts from note frontmatter`.

---

## Phase D: Review Schedule (PR 4)

### Task 12: Scheduling domain

**Files:** `web/src/domain/review-schedule.ts`, `web/src/domain/review-schedule.test.ts`

- [ ] Pure functions, viewer-local days (reuse `localDayKey`, `addLocalDays` from `lib/calendar.ts`):

```ts
export const RELEARN_DAYS = 1
export const REVIEW_LADDER_DAYS = [3, 7, 14, 30, 60] as const

export interface ReviewAttempt {
  readonly endedAt: string
  readonly outcome: SolveOutcome
}

export interface ReviewSchedule {
  /** Viewer-local day, `YYYY-MM-DD`, on which the item is due. */
  readonly dueDay: string
  readonly intervalDays: number
  readonly lastAttempt: ReviewAttempt
}

/**
 * Walks attempts oldest first. "needs-review" resets to RELEARN_DAYS. "success" climbs one
 * step of the ladder, capped at the last step. A success on the same local day as the
 * previous attempt does not climb, so cramming does not push reviews out.
 */
export function scheduleFrom(
  attempts: readonly ReviewAttempt[]
): ReviewSchedule | undefined

export function isDue(schedule: ReviewSchedule, today: string): boolean // dueDay <= today

export interface DueProblem {
  readonly problem: SolvedProblem
  readonly schedule: ReviewSchedule
}

/** Problems with at least one session whose schedule is due, most overdue first, then by id. */
export function dueProblems(
  problems: readonly SolvedProblem[],
  sessions: readonly SolveSession[],
  now: Date
): DueProblem[]
```

- [ ] Problems with no sessions are never scheduled (628 problems would otherwise flood the queue).
- [ ] Tests (global TZ is America/Los_Angeles): one success gives +3 days; two successes on different days give +7; success then needs-review gives +1; two successes the same day give +3; the ladder caps at 60; a session at 23:30 local counts for that local day; a due day across the DST change is still the right calendar day.
- [ ] Commit: `feat(platform): schedule problem reviews from practice sessions`.

### Task 13: Review page, nav badge, Today card, LeetCode suggestion

**Files:** `App.tsx`, `AppShell.tsx`, `Icon.tsx`, `pages/ReviewPage.tsx` (new), `pages/review/DueProblems.tsx` (new), move `pages/leetcode/RecentReflections.tsx` to `pages/review/`, `pages/today/ReviewCard.tsx`, `domain/recommendations.ts`, `SessionPanel.tsx`, `components/ui.tsx` (`ProgressBadge`), tests, `a11y.test.tsx`, `e2e/smoke.spec.ts`

- [ ] Add `cards` and `book` icons to `Icon.tsx`.
- [ ] Route `/review` → `ReviewPage` with sections: "Problems due" (links to `/leetcode?problem=<id>`, label "due today" / "due 3 days ago"), "Note questions" (filled by Task 18; hidden until then), and "Recent reflections" (moved from the LeetCode page).
- [ ] Nav: `Today | Review | Knowledge Map | LeetCode`. The Review item shows a badge with the due count: `<span className="nav-badge">3<span className="sr-only"> due</span></span>`. Below 30rem, hide nav labels visually (keep them for screen readers) so four items fit at 375 px.
- [ ] Today `ReviewCard` uses `dueProblems`. Its link reads "Review all" and goes to `/review`. Empty text: "Nothing due. Solved problems come back 3, 7, 14, 30, then 60 days after a clean solve."
- [ ] `choosePracticeProblem` prefers the most overdue due problem among the filtered set, then falls back to today's logic. `suggestionReason` says "Due for review since Nov 12."
- [ ] Session panel: after saving, the status line says "Next review Nov 26". Problem rows show a "Due" badge (precedence: due > needs review > solved).
- [ ] Remove `RecentReflections` from `LeetCodePage`.
- [ ] Tests: `ReviewPage.test.tsx`, nav badge count, updated `recommendations.test.ts`, `TodayPage.test.tsx` review card cases, `'#/review'` in a11y `ROUTES`, `/review` in e2e routes.
- [ ] Commit: `feat(platform): add a review page with due problems and a nav badge`.

---

## Phase E: Solution Viewer (PR 5)

### Task 14: Build-time highlighting

**Files:** `web/scripts/content/highlighter.mjs`, `web/scripts/content/solutions.mjs`, `web/scripts/generate-repository-data.mjs`, `.gitignore`, `web/src/data/content.ts`, `global.css`, `web/package.json`

- [ ] `yarn --cwd web add -D shiki`.
- [ ] `highlighter.mjs` creates one highlighter for the whole run with `themes: ['github-light', 'github-dark']` and `langs` = every `shiki` id in `tools/languages.json` that the repository uses. It exports `highlight(code, shikiLang)`, which calls `codeToHtml(code, { lang, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false })`. With `defaultColor: false`, tokens carry `--shiki-light` and `--shiki-dark` variables and no inline color, so the app's theme selectors decide.
- [ ] `solutions.mjs` writes `web/src/data/generated/content/solutions/<id>.json`: `{ problemId, files: [{ language, file, lines, html }] }`.
- [ ] Incremental build: keep `content/manifest.json` with a SHA-1 per source file. Re-highlight only changed files. Measure a cold run and record the time in the PR. Target is under 30 s.
- [ ] Add `web/src/data/generated/content/` to `.gitignore`. `generate-repository-data.mjs` now writes the snapshot and then awaits content generation.
- [ ] `data/content.ts`:

```ts
const solutionModules = import.meta.glob<SolutionContent>(
  "./generated/content/solutions/*.json",
  {
    import: "default",
  }
)

export async function loadSolutions(
  problemId: number
): Promise<SolutionContent | undefined> {
  const load =
    solutionModules[`./generated/content/solutions/${problemId}.json`]
  return load === undefined ? undefined : load()
}
```

- [ ] CSS for `.code-block`: background `--surface-sunken`, ignore Shiki's background variables, and map token colors in both theme selector forms:

```css
.code-block span {
  color: var(--shiki-light);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .code-block span {
    color: var(--shiki-dark);
  }
}
:root[data-theme="dark"] .code-block span {
  color: var(--shiki-dark);
}
```

- [ ] Verify contrast: Task 15's e2e step runs axe over a rendered solution in both schemes. If `github-light` or `github-dark` tokens fail on `--surface-sunken`, try another bundled theme pair before writing overrides.
- [ ] Commit: `feat(platform): highlight solutions at build time`.

### Task 15: Viewer UI

**Files:** `pages/leetcode/SolutionViewer.tsx`, `components/CodeBlock.tsx`, `SessionPanel.tsx`, tests, `a11y.test.tsx`, `e2e/smoke.spec.ts`

- [ ] The viewer is **collapsed by default** behind a "Show my solution" disclosure button (`aria-expanded`). Reviewing should start from memory, not from the answer. It does not remember the open state.
- [ ] When open: a tablist (`role="tablist" aria-label="Solutions"`), one tab per solution file showing its `LanguageIcon` (tab name `Go`, or `Python (2)` for a second file in the same language). Roving tabindex with Left/Right/Home/End per the WAI-ARIA tabs pattern.
- [ ] The tab panel holds the `CodeBlock`. It is a focusable scroll region (`tabIndex={0}`, labelled) so axe's `scrollable-region-focusable` passes. Toolbar: "Copy" (Clipboard API, toast "Copied"), line count, "View on GitHub" (`repositoryFileUrl`).
- [ ] The language chips from Task 5 are replaced by this viewer. Keep the "My solutions" folder link.
- [ ] States: loading (skeleton with `aria-busy`), missing content (dev server before generation): "Solution not built yet. Run `yarn --cwd web run generate:data`." plus the GitHub link.
- [ ] Tests mock `../../data/content`: disclosure, tab keyboard navigation, copy calls `navigator.clipboard.writeText`, axe with the viewer open. e2e: open problem 1, expand the viewer, run the contrast check in both schemes.
- [ ] Commit: `feat(platform): view your solutions inside the session panel`.

---

## Phase F: Notes (PR 6)

### Task 16: Build-time note rendering

**Files:** `web/scripts/content/notes.mjs`, `web/scripts/repository-data.mjs`, `web/src/data/types.ts`, `web/src/data/content.ts`, `notes/**` (link fixes only), tests

- [ ] `yarn --cwd web add -D markdown-it @types/markdown-it github-slugger`.
- [ ] Renderer: `markdown-it` with `html: false`, `linkify: true`, and `highlight` calling the Task 14 highlighter (unknown languages fall back to escaped text in a `.code-block`). Strip frontmatter. The leading `>` summary blockquote gets class `note-lead`.
- [ ] Heading ids use `github-slugger` (one slugger per note) so existing GitHub anchors keep working. Collect `toc: { id, text, depth }[]` for h2 and h3.
- [ ] Rewrite links in a markdown-it core rule:

| Source link                         | Output                                         |
| ----------------------------------- | ---------------------------------------------- |
| `#frag`                             | `#/notes/<topic>/<slug>?section=frag`          |
| `other.md`, `./other.md#frag`       | `#/notes/<topic>/other?section=frag`           |
| `../go/x.md#frag`                   | `#/notes/go/x?section=frag`                    |
| other relative paths (labs, images) | GitHub `blob/main/...` URL, opens in a new tab |
| `http(s)://…`                       | unchanged, `target="_blank" rel="noreferrer"`  |

- [ ] Link checking: the generator **fails** when a rewritten note link points to a missing note or a missing heading id. Fix any broken anchors in `notes/` in this PR.
- [ ] Mermaid: render the fence as a plain code block with a caption linking to the note on GitHub, where the diagram renders. One block today (`notes/go/mutex.md`).
- [ ] Write `content/notes/<topic>/<slug>.json`: `{ path, html, toc }`. Add `loadNote(topic, slug)` to `data/content.ts`.
- [ ] Snapshot (committed, small): `NoteSummary.slug`, `NoteSummary.questions: readonly string[]` (plain-text bullets under `## Questions this answers`), and `NoteSummary.headings` (the TOC without HTML, used by the palette).
- [ ] Tests in `repository-data.test.mjs` with a fixture note: link rewriting table, broken-link failure, question extraction, slug collisions (`## Notes` twice gives `notes` and `notes-1`).
- [ ] Commit: `feat(platform): render notes at build time with checked links`.

### Task 17: Note reader route

**Files:** `App.tsx`, `pages/NotePage.tsx`, `components/NoteContent.tsx`, `TopicCard.tsx`, `global.css` (`.prose`), tests, `a11y.test.tsx`, `e2e/smoke.spec.ts`

- [ ] Route `/notes/:topic/:slug`. Unknown note → the existing not-found page.
- [ ] Layout: breadcrumb (Knowledge Map › Go), `h1` title, date, concept tags, the article, a sticky table of contents at 64rem and wider (collapsible "On this page" below that), previous/next note in the topic, and "View on GitHub".
- [ ] `.prose` typography: 72ch measure, heading scale, lists, tables, blockquote, inline code, and the shared `.code-block`.
- [ ] `?section=<id>`: once content has loaded, scroll the heading into view and focus it (`tabIndex={-1}`). This runs after `RouteFocus` focuses the `h1`, because content loads asynchronously, so the section wins. Clicking an in-note link changes only the search, so the same effect handles it.
- [ ] `usePageTitle(note.title)`.
- [ ] `TopicCard` note links become internal `<Link>`s. Update `KnowledgeMapPage.test.tsx` (links are no longer external).
- [ ] Tests with `loadNote` mocked: renders, TOC links, section focus, previous/next. Add `'#/notes/go/channels'` to a11y `ROUTES` (mocked) and `/notes/go/channels` to e2e (real build).
- [ ] Commit: `feat(platform): read notes inside the workspace`.

### Task 18: Self-quiz from note questions

**Files:** `domain/personal-types.ts`, `state/storage.ts`, `state/backup.ts`, `state/learning-state.tsx`, `domain/quiz.ts`, `pages/review/QuestionRunner.tsx`, `ReviewPage.tsx`, `pages/today/ReviewCard.tsx`, `AppShell.tsx` (badge), tests

- [ ] Card id: `${note.path}::${slug(question)}`. If a question's wording changes, its card starts over; document this in the README.
- [ ] State (additive, version stays 1):

```ts
export interface CardReview {
  readonly cardId: string
  readonly reviewedAt: string
  readonly outcome: SolveOutcome
}

export interface PersonalLearningState {
  readonly version: 1
  readonly tasks: readonly LearningTask[]
  readonly sessions: readonly SolveSession[]
  readonly cardReviews: readonly CardReview[]
}
```

`sanitize` defaults a missing or invalid `cardReviews` to `[]` and drops invalid entries. Backup import accepts files without the field. Reset clears it. New actions: `cardReviewed`, `cardReviewUndone` (removes the matching `cardId` + `reviewedAt`).

- [ ] `domain/quiz.ts`: `dueCards(snapshot, cardReviews, now)` reuses `scheduleFrom` (map `reviewedAt` to `endedAt`). `newCardsForToday(...)` introduces at most `NEW_CARDS_PER_DAY = 5` never-reviewed cards per local day. Order: active topics first, newest notes first, questions in note order.
- [ ] Review page "Note questions" runner: the card shows topic, note title, and the question. "Show note" expands the rendered note inline (`NoteContent`, loaded lazily), so the user stays in the flow. Then grade "Got it" or "Shaky", with a toast and Undo. When nothing is left: "All caught up. New questions unlock tomorrow."
- [ ] Today card summary: "3 problems · 5 questions due". The nav badge counts due problems + due cards (not new cards, so the badge can reach zero).
- [ ] Tests: quiz domain (new-card cap, ordering, schedule reuse), storage and backup round-trips with and without `cardReviews` (old backups still import), runner interactions with Undo, axe with a card revealed.
- [ ] Commit: `feat(platform): quiz yourself on note questions with spaced review`.

---

## Phase G: Command Palette (PR 7)

### Task 19: Search index and matching

**Files:** `domain/search.ts`, `domain/search.test.ts`

- [ ] Item kinds: page (Today, Review, Knowledge Map, LeetCode), action (Toggle theme, Open settings, Start review), topic, note, note section (from `headings`, target `?section=`), problem (`#id` + title).
- [ ] Matching: a numeric query (`42`, `#42`) matches problem id prefixes, reusing the rule in `matchesQuery`. Otherwise a case-insensitive subsequence score: bonus for consecutive characters, for word starts, and for a prefix match. Rank by score, then kind (page > action > topic > note > section > problem), then title. Return at most 50.
- [ ] Build the index once at module load from the snapshot. Actions are added by the component.
- [ ] Tests: `#1` finds Two Sum first; "chan" finds Go Channels before section hits; "gmp" finds the scheduler note; an empty query returns pages and actions only.
- [ ] Commit: `feat(platform): add workspace search index`.

### Task 20: Palette dialog

**Files:** `components/CommandPalette.tsx`, `AppShell.tsx`, `global.css`, tests, `a11y.test.tsx`, `e2e/smoke.spec.ts`

- [ ] `<dialog>` opened with `showModal()`, like `SettingsDialog`, so `isModalOpen()` already blocks the `/` shortcut and toast Undo behind it.
- [ ] Combobox pattern: input `role="combobox"`, `aria-expanded`, `aria-controls` the listbox, `aria-activedescendant` the active option. Results grouped (`role="group"` with a label per kind). Keys: Up/Down, Home/End, Enter runs, Esc closes. Problems show their language icons (decorative).
- [ ] Open with Cmd+K / Ctrl+K from anywhere, unless another dialog is open or the user is composing text (IME). Add a header button: search icon + "Search" + `<kbd>⌘K</kbd>` (text hidden below 48rem, accessible name kept). Close returns focus to the opener.
- [ ] Running an item navigates, or runs the action (theme toggle, open settings).
- [ ] Tests: open by shortcut and by button, keyboard selection, action runs, focus returns, axe while open. e2e: Cmd+K opens on every route.
- [ ] Commit: `feat(platform): add a command palette`.

### Task 21: Docs

**Files:** `README.md`, `docs/superpowers/specs/2026-11-17-learning-platform-design.md`

- [ ] README "Learning platform": routes (Today, Review, Knowledge Map, LeetCode, note reader), shortcuts (⌘K, `/`, Esc, Ctrl/Cmd+Z, Ctrl/Cmd+Enter), the review ladder (1 day after "needs review"; 3, 7, 14, 30, 60 days after clean solves), 5 new questions per day, the theme toggle rule, and `yarn --cwd web run vendor:icons` for new languages.
- [ ] Spec: append "Revision 2026-11-19 (icons, review, notes)" with the Decisions table and the `cardReviews` state addition.
- [ ] Commit: `docs(platform): document icons, review loop, notes, and palette`.

---

## Verification (every PR)

```sh
make platform-test                 # unit and accessibility tests
yarn --cwd web run check           # type check
make platform-build                # includes generate:data
make platform-e2e                  # viewport and contrast, both schemes
```

Plus: `git diff --exit-code web/src/data/generated/repository.ts` after `generate:data`; `dependencies` in `web/package.json` unchanged; main chunk size recorded against the 451 kB / 25 kB-gzip budget.

## Risks

- **Build time.** About 1,600 solution files go through Shiki. The manifest cache keeps rebuilds fast; check the cold run in CI.
- **Trademarks.** Brand marks are recolored for contrast. This is acceptable for a personal, non-commercial tool, and the license file records the sources.
- **Broken anchors.** Strict link checking may fail on existing notes. Fixing them is part of Task 16.
- **Narrow nav.** Four nav items plus a badge at 375 px. Task 13 hides labels visually below 30rem; the e2e viewport test guards it.
- **Generated content in tests.** It is gitignored and absent in unit tests. All access goes through `data/content.ts`, which tests mock; e2e runs against a real build.
