# Personal Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a static, local-first React workspace that turns this repository's learning evidence into a daily learning dashboard, knowledge map, and LeetCode review workflow.

**Architecture:** A Vite React single-page app in web/ consumes a TypeScript snapshot generated from the repository during development and builds. Repository facts stay immutable; a typed React reducer persists personal tasks and completed solving sessions in versioned localStorage. Hash routes make Today, Knowledge Map, and LeetCode work under GitHub Pages.

**Tech Stack:** Node.js 22, Yarn 1, Vite 8, React 19, React Router 7, TypeScript, native CSS, Vitest, React Testing Library, and GitHub Pages.

**Spec:** docs/superpowers/specs/2026-11-17-learning-platform-design.md

## Global Constraints

- Keep the app entirely in web/; preserve existing Markdown, Python tooling, Make targets, and organizer behavior.
- Use strict TypeScript; use React 19 with React Router 7 HashRouter and NavLink.
- Require Node.js ^20.19.0 || >=22.12.0; CI uses Node 22.
- Configure Vite production asset base as /compscie/.
- Ship no credentials and make no runtime network requests.
- Commit web/src/data/generated/repository.ts; regenerate it in predev, prebuild, and CI.
- Persist only tasks and completed sessions under compscie.learning-platform.v1; reset cannot alter repository data.
- v1 contains Today, Knowledge Map, and LeetCode only: no accounts, cloud sync, code editor, LeetCode API, Review route, or Library route.

## Review Focus

- Corrupt or obsolete localStorage produces empty v1 state; Task 3 owns the test.
- Duplicate solved problem ids fail generation with the conflicting id; Task 2 owns the test.
- Filters with no matching problem show an empty state and no proposed problem; Task 6 owns the test.
- Weekly completion count observes an ISO-week Sunday/Monday boundary; Task 3 owns the test.
- Keyboard users reach all three routes and create/complete a task; Task 4 owns the test.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| web/package.json, web/vite.config.ts, web/tsconfig*.json | Isolated Vite, TypeScript, test, and script configuration. |
| web/scripts/repository-data.mjs | Parser and serializer for repository learning evidence. |
| web/scripts/generate-repository-data.mjs | CLI that writes the committed browser data module. |
| web/src/data/types.ts and generated/repository.ts | Repository contracts and immutable generated snapshot. |
| web/src/domain/recommendations.ts | Pure Today and LeetCode filtering/ranking rules. |
| web/src/state/learning-state.tsx | Reducer, state context, and browser persistence boundary. |
| web/src/components/ and web/src/pages/ | Accessible shell and route-sized UI features. |
| .github/workflows/learning-platform.yml | Freshness, quality, build, and Pages deployment. |

### Task 1: Bootstrap the isolated React application

**Files:**

- Create: web/package.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json
- Create: web/src/main.tsx, web/src/App.tsx, web/src/styles/global.css, web/src/test/setup.ts, web/src/App.test.tsx
- Modify: .gitignore, Makefile

**Interfaces:**

- Produces App(): JSX.Element and dev, build, test, and check scripts.
- Produces Vite configuration with base "/compscie/", React plugin, jsdom, and the test setup file.

- [x] **Step 1: Write the failing smoke test**

~~~tsx
it("renders the Compscie learning workspace", () => {
  render(<App />);
  expect(screen.getByRole("banner", { name: /compscie/i })).toBeInTheDocument();
});
~~~

- [x] **Step 2: Run the test to verify it fails**

Run: yarn --cwd web test App.test.tsx --run

Expected: FAIL because the web package and App module do not exist.

- [x] **Step 3: Implement the Vite/React foundation**

Add React 19, react-dom, and react-router as runtime dependencies. Add Vite 8, @vitejs/plugin-react, TypeScript, Vitest, jsdom, and Testing Library packages as dev dependencies. Set engines.node to ^20.19.0 || >=22.12.0. Configure strict compilation and an accessible, responsive CSS baseline. At this stage, App has only a semantic branded header and main landmark.

- [x] **Step 4: Add developer entry points**

Add platform, platform-test, and platform-build Make targets that delegate to yarn --cwd web. Add .superpowers/, web/dist/, and web/coverage/ to .gitignore; do not ignore generated source.

- [x] **Step 5: Verify and commit**

Run: yarn --cwd web check && yarn --cwd web test --run && yarn --cwd web build

Expected: PASS; web/dist/index.html exists.

~~~sh
git add .gitignore Makefile web
git commit -m "feat(platform): scaffold React learning workspace"
~~~

### Task 2: Generate immutable repository learning data

**Files:**

- Create: web/src/data/types.ts, web/scripts/repository-data.mjs, web/scripts/generate-repository-data.mjs
- Create: web/scripts/repository-data.test.mjs, web/scripts/fixtures/*, web/src/data/generated/repository.ts
- Modify: web/package.json

**Interfaces:**

- Produces RepositorySnapshot, TopicSummary, NoteSummary, SolvedProblem, and Difficulty.
- Produces collectRepositorySnapshot(repoRoot: string): RepositorySnapshot and renderRepositoryModule(snapshot: RepositorySnapshot): string.
- Consumes topic READMEs/notes, canonical LeetCode folders, and tools/leetcode-index.tsv; it never changes them.

- [x] **Step 1: Write failing generator tests**

~~~js
test("collects topics, notes, solved problems, and languages", () => {
  const snapshot = collectRepositorySnapshot(fixtureRoot);
  assert.equal(snapshot.topics[0].slug, "clickhouse");
  assert.equal(snapshot.problems[0].id, 1);
  assert.deepEqual(snapshot.problems[0].languages, ["Go", "TypeScript"]);
});

test("rejects duplicate solved problem ids", () => {
  assert.throws(() => collectRepositorySnapshot(duplicateFixtureRoot), /duplicate.*1/i);
});
~~~

Use tiny fixture repositories so duplicate-id coverage is controlled.

- [x] **Step 2: Run the generator tests to verify they fail**

Run: node --test web/scripts/repository-data.test.mjs

Expected: FAIL because the parser does not exist.

- [x] **Step 3: Implement repository data generation**

Parse topic README frontmatter (title, status, focus, next, started), note title/date frontmatter, problem folder ids, and TSV title/difficulty/tags. Derive languages from solution extensions using organizer display names. Sort topics by slug, notes newest-first then filename, and problems by id. Throw before output on duplicate numeric ids. Serialize a browser-safe repositorySnapshot module without filesystem imports.

- [x] **Step 4: Wire data freshness into local scripts**

Add generate:data, predev, and prebuild scripts. The CLI resolves repository root relative to itself, writes web/src/data/generated/repository.ts, and is run once so the file is committed.

- [x] **Step 5: Verify and commit**

Run: node --test web/scripts/repository-data.test.mjs && yarn --cwd web generate:data && yarn --cwd web check

Expected: PASS; generated data includes Go, ClickHouse, and every discovered solved problem.

~~~sh
git add web/package.json web/scripts web/src/data
git commit -m "feat(platform): generate repository learning snapshot"
~~~

### Task 3: Add local-first state and deterministic recommendations

**Files:**

- Create: web/src/domain/personal-types.ts, web/src/domain/recommendations.ts, web/src/domain/recommendations.test.ts
- Create: web/src/state/storage.ts, web/src/state/storage.test.ts, web/src/state/learning-state.tsx, web/src/state/learning-state.test.ts

**Interfaces:**

- Produces LearningTask, SolveSession, PersonalLearningState, LearningAction, and FILTER_ALL = "all".
- Produces getTodayRecommendation(snapshot, state), filterProblems(problems, filters), choosePracticeProblem(problems, sessions), and countCompletedThisIsoWeek(tasks, now).
- Produces LearningProvider, useLearningState(), and useLearningDispatch().

- [x] **Step 1: Write failing domain and storage tests**

~~~ts
it("prefers the earliest open task over deferred tasks and topic fallbacks", () => {
  expect(getTodayRecommendation(snapshot, state)).toMatchObject({ kind: "task", taskId: "open-first" });
});

it("uses empty v1 state for malformed local storage", () => {
  localStorage.setItem(STORAGE_KEY, "{not-json");
  expect(loadPersonalState()).toEqual(emptyPersonalState());
});

it("starts a new ISO week on Monday", () => {
  expect(countCompletedThisIsoWeek(tasks, new Date("2026-11-16T09:00:00Z"))).toBe(1);
});
~~~

Also test the exact LeetCode rank: needs-review, then never-practiced, then least-recent completed, then ascending id; and the intersection of difficulty, language, and tag filters.

- [x] **Step 2: Run tests to verify they fail**

Run: yarn --cwd web test recommendations storage learning-state --run

Expected: FAIL because state and selector modules do not exist.

- [x] **Step 3: Implement reducer, persistence, and selectors**

Use actions taskAdded, taskCompleted, taskDeferred, sessionCompleted, and stateReset. Give manual tasks crypto.randomUUID() ids. LearningProvider initializes with loadPersonalState and writes via savePersonalState after updates. Treat any stored value without version 1, task array, and session array as empty state. Implement only the fixed ordering rules in the design: no randomness or opaque scoring.

- [x] **Step 4: Verify and commit**

Run: yarn --cwd web test recommendations storage learning-state --run && yarn --cwd web check

Expected: PASS, including malformed-storage and week-boundary tests.

~~~sh
git add web/src/domain web/src/state
git commit -m "feat(platform): add local learning state and recommendations"
~~~

### Task 4: Build the app shell and Today workflow

**Files:**

- Create: web/src/components/AppShell.tsx, web/src/components/TaskComposer.tsx, web/src/components/TaskList.tsx
- Create: web/src/pages/TodayPage.tsx, web/src/pages/TodayPage.test.tsx
- Modify: web/src/App.tsx, web/src/styles/global.css

**Interfaces:**

- Consumes Task 3 provider, hooks, and selectors.
- Produces AppShell({ children }: PropsWithChildren) with Today, Knowledge Map, and LeetCode navigation; produces TodayPage(): JSX.Element.

- [ ] **Step 1: Write failing UI/accessibility tests**

~~~tsx
it("adds a task, recommends it, and completes it", async () => {
  render(<App />);
  await user.type(screen.getByLabelText(/task title/i), "Run the date-parts lab");
  await user.click(screen.getByRole("button", { name: /add task/i }));
  expect(screen.getByRole("heading", { name: /run the date-parts lab/i })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /complete run the date-parts lab/i }));
  expect(screen.getByText(/completed this week: 1/i)).toBeInTheDocument();
});
~~~

Use userEvent.tab() and Enter to reach navigation and submit the task form. Assert the default Today route and aria-current="page" on the active route.

- [ ] **Step 2: Run tests to verify they fail**

Run: yarn --cwd web test TodayPage App --run

Expected: FAIL because routes and task controls do not exist.

- [ ] **Step 3: Implement the dashboard**

Wrap App in HashRouter and LearningProvider. Use NavLink in a labelled banner and render a main landmark. Today displays the selector's next action, accessible task title/topic/minutes inputs, Complete and Defer controls, weekly completion total, and a confirmed Reset action. Explain that repository facts are read-only and working state stays in this browser.

- [ ] **Step 4: Verify and commit**

Run: yarn --cwd web test TodayPage App --run && yarn --cwd web build

Expected: PASS; built assets use /compscie/.

~~~sh
git add web/src/App.tsx web/src/components web/src/pages/TodayPage* web/src/styles/global.css
git commit -m "feat(platform): add daily learning dashboard"
~~~

### Task 5: Build the explicit Knowledge Map

**Files:**

- Create: web/src/data/map-relationships.ts, web/src/components/KnowledgeMap.tsx, web/src/components/TopicCard.tsx
- Create: web/src/pages/KnowledgeMapPage.tsx, web/src/pages/KnowledgeMapPage.test.tsx
- Modify: web/src/App.tsx, web/src/styles/global.css

**Interfaces:**

- Consumes repositorySnapshot and TopicRelationship[].
- Produces KnowledgeMapPage() at #/map.

- [ ] **Step 1: Write failing map tests**

~~~tsx
it("shows active topics, notes, and curated concepts", () => {
  render(<KnowledgeMapPage />);
  expect(screen.getByRole("heading", { name: "Go" })).toBeInTheDocument();
  expect(screen.getByText("Production diagnostics")).toBeInTheDocument();
  expect(screen.getByText("Sparse indexing")).toBeInTheDocument();
});

~~~

Assert the snapshot note/problem/language counts and a readable text alternative for visual connections.

- [ ] **Step 2: Run tests to verify they fail**

Run: yarn --cwd web test KnowledgeMapPage --run

Expected: FAIL because the map route and curated relationships do not exist.

- [ ] **Step 3: Implement the explicit map**

Define exactly seven entries: Go to Runtime, Concurrency, Memory, Production diagnostics; ClickHouse to MergeTree storage, Sparse indexing, Date/time queries. Render active-topic cards with focus, next step, note links, and snapshot counts. Visual connectors are progressive enhancement: every relationship has a readable text equivalent.

- [ ] **Step 4: Verify and commit**

Run: yarn --cwd web test KnowledgeMapPage --run && yarn --cwd web check

Expected: PASS with complete text equivalents.

~~~sh
git add web/src/data/map-relationships.ts web/src/components/KnowledgeMap.tsx web/src/components/TopicCard.tsx web/src/pages/KnowledgeMapPage* web/src/App.tsx web/src/styles/global.css
git commit -m "feat(platform): add repository knowledge map"
~~~

### Task 6: Build the LeetCode review and reflection workspace

**Files:**

- Create: web/src/components/ProblemFilters.tsx, web/src/components/ProblemList.tsx, web/src/components/SolveSessionPanel.tsx
- Create: web/src/pages/LeetCodePage.tsx, web/src/pages/LeetCodePage.test.tsx
- Modify: web/src/App.tsx, web/src/styles/global.css

**Interfaces:**

- Consumes the Task 2 snapshot and Task 3 filter/ranking functions and state hooks.
- Produces LeetCodePage() at #/leetcode; view filters are route-local and completed sessions dispatch sessionCompleted.

- [ ] **Step 1: Write failing interaction tests**

~~~tsx
it("filters solved problems by difficulty, language, and pattern", async () => {
  render(<LeetCodePage />, { wrapper: TestLearningProvider });
  await user.selectOptions(screen.getByLabelText(/difficulty/i), "medium");
  await user.selectOptions(screen.getByLabelText(/language/i), "Go");
  await user.selectOptions(screen.getByLabelText(/pattern/i), "graph");
  expect(screen.getByRole("list", { name: /matching solved problems/i })).toHaveTextContent("Course Schedule II");
});

it("shows no proposal for empty filters", async () => {
  render(<LeetCodePage />, { wrapper: TestLearningProvider });
  await user.selectOptions(screen.getByLabelText(/language/i), "C#");
  expect(screen.getByText(/no solved problems match/i)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /start solving/i })).not.toBeInTheDocument();
});
~~~

Add a test that starts the proposal, completes it as needs-review with a trimmed reflection, remounts, and sees the saved reflection.

- [ ] **Step 2: Run tests to verify they fail**

Run: yarn --cwd web test LeetCodePage --run

Expected: FAIL because filters, sessions, and the route do not exist.

- [ ] **Step 3: Implement the review workflow**

Build difficulty/language/tag options from the snapshot and filter by intersection. Link rows to canonical repository solution directories. Show the deterministic proposal card. The session timer starts only after Start; require trimmed reflection and a selected success/needs-review outcome before sessionCompleted. Label it as review of already-solved work: do not fetch, submit, or edit LeetCode code.

- [ ] **Step 4: Verify and commit**

Run: yarn --cwd web test LeetCodePage recommendations storage --run && yarn --cwd web build

Expected: PASS for filtering, empty state, reflection persistence, ranking, and static build.

~~~sh
git add web/src/components/Problem* web/src/components/SolveSessionPanel.tsx web/src/pages/LeetCodePage* web/src/App.tsx web/src/styles/global.css
git commit -m "feat(platform): add LeetCode review workspace"
~~~

### Task 7: Add quality automation, deployment, and usage documentation

**Files:**

- Create: .github/workflows/learning-platform.yml
- Modify: README.md, web/package.json

**Interfaces:**

- Consumes Tasks 1–2 scripts and produces a GitHub Pages artifact from web/dist plus documented local commands.

- [ ] **Step 1: Write the generated-data freshness check**

~~~sh
yarn --cwd web generate:data
git diff --exit-code -- web/src/data/generated/repository.ts
~~~

Expected before a stale generated file is refreshed: FAIL with its diff.

- [ ] **Step 2: Implement CI and docs**

On default-branch pushes and manual dispatch, checkout, use Node 22 with Yarn cache, install with yarn --cwd web install --frozen-lockfile, run freshness/type/test/build commands, then configure Pages, upload web/dist, and deploy. Grant only contents: read, pages: write, and id-token: write; use one cancel-in-progress deployment group. Document make platform, make platform-test, local-only persistence, and expected GitHub Pages URL in README.md.

- [ ] **Step 3: Verify delivery quality and commit**

Run: yarn --cwd web generate:data && git diff --exit-code -- web/src/data/generated/repository.ts && yarn --cwd web check && yarn --cwd web test --run && yarn --cwd web build

Expected: every command exits 0 and generated data is fresh.

~~~sh
git add .github/workflows/learning-platform.yml README.md web
git commit -m "ci(platform): deploy learning workspace to Pages"
~~~

## Self-Review

- **Spec coverage:** Tasks 1 and 7 cover static foundation/deployment; Task 2 repository data; Task 3 local state and ordering; Task 4 Today; Task 5 Knowledge Map; Task 6 LeetCode.
- **Step scan:** every task starts with a concrete failing assertion, names interfaces, gives verification, and ends in a reviewable commit.
- **Type consistency:** Task 2 creates repository contracts; Task 3 adds personal state/selectors; Tasks 4–6 consume only those exports.
- **Review focus:** every listed failure condition has an owning test in Tasks 2–6.
- **Proportion:** the plan specifies interfaces, fixed values, routes, and tests without transcribing implementation bodies.
