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
