import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FILTER_ALL } from '../../domain/recommendations'
import { ProblemBrowser } from './ProblemBrowser'
import type { LeetCodeParams } from './useLeetCodeParams'

function renderBrowser(query: string, update: LeetCodeParams['update']) {
  const params: LeetCodeParams = {
    difficulty: FILTER_ALL,
    language: FILTER_ALL,
    tag: FILTER_ALL,
    query,
    problemId: undefined,
    update,
  }

  return (
    <ProblemBrowser
      params={params}
      problems={[]}
      selectedId={undefined}
      latestSessions={new Map()}
      dueIds={new Set()}
      onSelect={() => undefined}
    />
  )
}

describe('ProblemBrowser search draft', () => {
  it('ignores a stale URL echo but follows external changes', async () => {
    const user = userEvent.setup()
    const update = vi.fn()
    const { rerender } = render(renderBrowser('', update))

    const search = screen.getByRole('searchbox', { name: /search problems/i })
    await user.type(search, 'ab')
    expect(search).toHaveValue('ab')

    rerender(renderBrowser('a', update))
    expect(search).toHaveValue('ab')

    rerender(renderBrowser('ab', update))
    expect(search).toHaveValue('ab')

    rerender(renderBrowser('xyz', update))
    expect(search).toHaveValue('xyz')
  })
})
