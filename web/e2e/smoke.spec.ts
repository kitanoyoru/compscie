import { createRequire } from 'node:module'

import { expect, test, type Page } from '@playwright/test'

const ROUTES = ['#/', '#/review', '#/map', '#/leetcode'] as const
const AXE_PATH = createRequire(import.meta.url).resolve('axe-core')
const STORAGE_KEY = 'compscie.learning-platform.v1'

const SEEDED_STATE = {
  version: 1,
  tasks: [
    { id: 'task-open', title: 'Read the Go scheduler notes', topicId: 'go', estimatedMinutes: 30, status: 'open', createdAt: '2026-11-16T09:00:00.000Z' },
    { id: 'task-deferred', title: 'Review ClickHouse merge trees', topicId: 'clickhouse', estimatedMinutes: 45, status: 'deferred', createdAt: '2026-11-17T09:00:00.000Z' },
    { id: 'task-completed', title: 'Finish the Go channels lab', topicId: 'go', estimatedMinutes: 20, status: 'completed', createdAt: '2026-11-18T09:00:00.000Z', completedAt: '2026-11-19T10:00:00.000Z' },
  ],
  sessions: [
    { problemId: 1, startedAt: '2026-11-18T12:00:00.000Z', endedAt: '2026-11-18T12:40:00.000Z', outcome: 'needs-review', reflection: 'Missed the edge case with empty input.' },
    { problemId: 2, startedAt: '2026-11-19T12:00:00.000Z', endedAt: '2026-11-19T12:25:00.000Z', outcome: 'success' },
  ],
}

/** Covered by the flattened per-stop tests below. */
const GRADIENT_CARD: ContrastOptions = { ignoreIncompleteWithin: ['.next-action'] }

type Scheme = 'light' | 'dark'

interface NavigateOptions {
  readonly scheme?: Scheme
  /** Stored theme preference; when omitted the app follows the emulated OS scheme. */
  readonly theme?: Scheme
  readonly seeded?: boolean
  readonly width?: number
}

/** Single entry point for every test: pins clock, color scheme, storage and viewport. */
async function navigate(page: Page, route: string, options: NavigateOptions = {}): Promise<void> {
  const { scheme = 'light', theme, seeded = false, width } = options
  if (width !== undefined) await page.setViewportSize({ width, height: 800 })
  await page.emulateMedia({ colorScheme: scheme })
  await page.clock.install({ time: new Date('2026-11-19T18:00:00Z') })
  if (theme) await page.addInitScript((value) => localStorage.setItem('compscie.theme', value), theme)
  if (seeded) {
    await page.addInitScript(
      ([key, value]) => localStorage.setItem(key as string, value as string),
      [STORAGE_KEY, JSON.stringify(SEEDED_STATE)],
    )
  }
  await page.goto(`/compscie/${route}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

/**
 * axe reports nodes it cannot measure as `incomplete`, which would otherwise pass silently,
 * so any unmeasurable contrast result fails the test unless it lies within `ignoreIncompleteWithin`
 * (stable selectors only, never generated ids). The only user is the gradient card, whose two
 * gradient stops are measured separately by flattening it.
 */
interface ContrastOptions {
  readonly ignoreIncompleteWithin?: readonly string[]
}

async function expectNoContrastIssues(page: Page, { ignoreIncompleteWithin = [] }: ContrastOptions = {}): Promise<void> {
  // select.input draws only a small chevron image at its right edge (the text sits on a solid
  // background-color), but axe treats any background-image as unmeasurable. Drop the chevron so
  // the select's text is actually measured; the chevron is a non-text graphic.
  await page.addStyleTag({ content: 'select.input { background-image: none !important; }' })
  await page.addScriptTag({ path: AXE_PATH })
  const { violations, incomplete } = await page.evaluate(async (ignore) => {
    type Rule = { nodes: Array<{ target: unknown[]; element?: Element; any: Array<{ data: unknown; message: string }> }> }
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: Rule[]; incomplete: Rule[] }> } }).axe
    const results = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] }, elementRef: true })
    const flatten = (rules: Rule[], skipIgnored: boolean) =>
      rules.flatMap((rule) =>
        rule.nodes
          .filter((node) => !(skipIgnored && ignore.some((selector) => node.element?.closest(selector))))
          .map((node) => ({
            target: node.target.join(' '),
            message: node.any.map((check) => check.message).join(' | '),
            data: node.any.map((check) => check.data),
          })),
      )
    return { violations: flatten(results.violations, false), incomplete: flatten(results.incomplete, true) }
  }, [...ignoreIncompleteWithin])

  expect(violations, `contrast violations:\n${JSON.stringify(violations, null, 2)}`).toEqual([])
  expect(incomplete, `unmeasurable (incomplete) contrast results:\n${JSON.stringify(incomplete, null, 2)}`).toEqual([])
}

for (const width of [360, 390, 1280]) {
  for (const route of ROUTES) {
    test(`${route} fits ${width}px without horizontal scroll`, async ({ page }) => {
      await navigate(page, route, { width })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${route} at ${width}px overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(0)
    })
  }
}

for (const scheme of ['light', 'dark'] as const) {
  for (const route of ROUTES) {
    test(`${route} has no contrast issues (${scheme}, system preference)`, async ({ page }) => {
      await navigate(page, route, { scheme })
      const root = await page.evaluate(() => ({
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        dataTheme: document.documentElement.getAttribute('data-theme'),
      }))
      expect(root.dataTheme).toBeNull()
      expect(root.colorScheme).toContain(scheme)
      await expectNoContrastIssues(page, GRADIENT_CARD)
    })

    test(`${route} has no contrast issues (${scheme}, stored theme, seeded state)`, async ({ page }) => {
      // The OS preference is the opposite, so the stored key must win.
      await navigate(page, route, { scheme: scheme === 'dark' ? 'light' : 'dark', theme: scheme, seeded: true })
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme)
      await expectNoContrastIssues(page, GRADIENT_CARD)
    })
  }

  // The next-action card paints linear-gradient(accent-soft, surface). axe cannot sample a
  // gradient, so measure both stops flattened in turn; the interpolation lies between them.
  for (const stop of ['--accent-soft', '--surface'] as const) {
    test(`home next-action card has no contrast issues on ${stop} (${scheme})`, async ({ page }) => {
      await navigate(page, '#/', { scheme, seeded: true })
      await page.addStyleTag({ content: `.next-action { background: var(${stop}) !important; }` })
      await expect(page.locator('.next-action')).toBeVisible()
      await expectNoContrastIssues(page)
    })
  }

  test(`home has no contrast issues with a toast visible (${scheme})`, async ({ page }) => {
    await navigate(page, '#/', { scheme, seeded: true })
    await page.getByRole('button', { name: /^Complete Read the Go scheduler notes/ }).click()
    await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
    await expectNoContrastIssues(page, GRADIENT_CARD)
  })

  test(`every solution tab of Two Sum has no contrast issues (${scheme})`, async ({ page }) => {
    await navigate(page, '#/leetcode?problem=1', { scheme })
    await page.getByRole('button', { name: 'Show my solution' }).click()
    const tabs = page.getByRole('tablist', { name: 'Solutions' }).getByRole('tab')
    await expect(tabs.first()).toBeVisible()

    const count = await tabs.count()
    expect(count).toBeGreaterThan(1)
    for (let index = 0; index < count; index += 1) {
      await tabs.nth(index).click()
      await expect(page.locator('.code-block pre')).toBeVisible()
      await expectNoContrastIssues(page)
    }
  })

  test(`settings dialog fits 360px and has no contrast issues (${scheme})`, async ({ page }) => {
    await navigate(page, '#/', { scheme, seeded: true, width: 360 })
    await page.getByRole('button', { name: 'Settings' }).click()
    const dialog = page.getByRole('dialog', { name: 'Settings' })
    await expect(dialog).toBeVisible()

    const box = await dialog.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(360)

    await expectNoContrastIssues(page, GRADIENT_CARD)
  })
}

test('knowledge-map concept rows contain their content at 360px', async ({ page }) => {
  await navigate(page, '#/map', { width: 360 })

  // Each li is a fixed 36px row. Content overflows if the button's rendered box or
  // scroll height exceeds the row's, so check both the li and its descendants.
  const rows = page.locator('.fan-concepts li')
  expect(await rows.count()).toBeGreaterThan(0)
  const overflowing = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('.fan-concepts li')).flatMap((li) => {
      const row = li.getBoundingClientRect()
      const control = li.querySelector<HTMLElement>('button, a')
      const box = control?.getBoundingClientRect()
      const problems: string[] = []
      if (li.scrollHeight > li.clientHeight + 1) problems.push(`li scrollHeight ${li.scrollHeight} > ${li.clientHeight}`)
      if (control && control.scrollHeight > control.clientHeight + 1) problems.push(`control scrollHeight ${control.scrollHeight} > ${control.clientHeight}`)
      if (box && (box.top < row.top - 1 || box.bottom > row.bottom + 1)) problems.push(`control box ${box.height} outside row ${row.height}`)
      return problems.length ? [`${(li.textContent ?? '').trim()}: ${problems.join('; ')}`] : []
    }),
  )
  expect(overflowing).toEqual([])
})
