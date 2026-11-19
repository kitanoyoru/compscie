import { createRequire } from 'node:module'

import { expect, test, type Page } from '@playwright/test'

const ROUTES = ['#/', '#/map', '#/leetcode'] as const
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

type Scheme = 'light' | 'dark'

async function gotoRoute(page: Page, route: string, scheme: Scheme, seeded = false): Promise<void> {
  // Theme comes from the stored key in one pass and from the OS preference in the other.
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
  if (seeded) {
    await page.addInitScript(
      ([key, value]) => localStorage.setItem(key as string, value as string),
      [STORAGE_KEY, JSON.stringify(SEEDED_STATE)],
    )
  }
  await page.goto(`/compscie/${route}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

async function expectNoContrastViolations(page: Page): Promise<void> {
  await page.addScriptTag({ path: AXE_PATH })
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: Array<{ nodes: Array<{ target: unknown[]; any: Array<{ data: unknown }> }> }> }> } }).axe
    const results = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } })
    return results.violations.flatMap((violation) =>
      violation.nodes.map((node) => ({ target: node.target.join(' '), data: node.any.map((check) => check.data) })),
    )
  })
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
}

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

for (const scheme of ['light', 'dark'] as const) {
  for (const route of ROUTES) {
    test(`${route} has no contrast violations (${scheme}, system preference)`, async ({ page }) => {
      await gotoRoute(page, route, scheme)
      await expectNoContrastViolations(page)
    })

    test(`${route} has no contrast violations (${scheme}, stored theme, seeded state)`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('compscie.theme', value), scheme)
      await gotoRoute(page, route, scheme === 'dark' ? 'light' : 'dark', true)
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme)
      await expectNoContrastViolations(page)
    })
  }

  test(`home has no contrast violations with a toast visible (${scheme})`, async ({ page }) => {
    await gotoRoute(page, '#/', scheme, true)
    await page.getByRole('button', { name: /^Complete Read the Go scheduler notes/ }).click()
    await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
    await expectNoContrastViolations(page)
  })

  test(`settings dialog fits 360px and has no contrast violations (${scheme})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await gotoRoute(page, '#/', scheme, true)
    await page.getByRole('button', { name: 'Settings' }).click()
    const dialog = page.getByRole('dialog', { name: 'Settings' })
    await expect(dialog).toBeVisible()

    const box = await dialog.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(360)

    await expectNoContrastViolations(page)
  })
}

test('knowledge-map concept rows contain their content at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/compscie/#/map')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  // Each li is a fixed 36px row. Content overflows if the button's rendered box or
  // scroll height exceeds the row's, so check both the li and its descendants.
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
  expect(await page.locator('.fan-concepts li').count()).toBeGreaterThan(0)
  expect(overflowing).toEqual([])
})
