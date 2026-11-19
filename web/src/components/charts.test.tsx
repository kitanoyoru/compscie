import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { DayActivity } from '../domain/insights'
import { WeekStrip } from './charts'

const dates = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22']

function week(counts: ReadonlyArray<readonly [number, number]>): DayActivity[] {
  return dates.map((date, index) => ({ date, tasks: counts[index]?.[0] ?? 0, sessions: counts[index]?.[1] ?? 0 }))
}

function segments(item: HTMLElement, series: 'tasks' | 'sessions'): HTMLElement[] {
  return Array.from(item.querySelectorAll<HTMLElement>(`.week-seg[data-series="${series}"]`))
}

describe('WeekStrip', () => {
  it('stacks task and session segments sized by their counts', () => {
    render(
      <WeekStrip
        days={week([
          [1, 0],
          [2, 1],
          [0, 3],
        ])}
        today="2026-11-17"
      />,
    )

    const items = within(screen.getByRole('list', { name: 'Activity this week' })).getAllByRole('listitem')

    // Monday: tasks only.
    expect(segments(items[0]!, 'tasks')).toHaveLength(1)
    expect(segments(items[0]!, 'sessions')).toHaveLength(0)

    // Tuesday: both, flex-grow equals the counts.
    expect(segments(items[1]!, 'tasks')[0]).toHaveStyle({ flexGrow: '2' })
    expect(segments(items[1]!, 'sessions')[0]).toHaveStyle({ flexGrow: '1' })

    // Wednesday: sessions only.
    expect(segments(items[2]!, 'tasks')).toHaveLength(0)
    expect(segments(items[2]!, 'sessions')[0]).toHaveStyle({ flexGrow: '3' })

    // Bar height scales against the week's max total (3): Monday 1/3, Tuesday and Wednesday full.
    const bar = (item: HTMLElement) => item.querySelector<HTMLElement>('.week-bar')!
    expect(bar(items[0]!).style.getPropertyValue('--ratio')).toBe(String(1 / 3))
    expect(bar(items[1]!).style.getPropertyValue('--ratio')).toBe('1')
    expect(bar(items[2]!).style.getPropertyValue('--ratio')).toBe('1')

    expect(items[1]).toHaveAttribute('data-today', 'true')
    expect(items[0]).not.toHaveAttribute('data-today')
  })

  it('renders an empty week with every day marked empty', () => {
    render(<WeekStrip days={week([])} today="2026-11-19" />)

    const items = within(screen.getByRole('list', { name: 'Activity this week' })).getAllByRole('listitem')

    expect(items).toHaveLength(7)
    for (const item of items) {
      expect(item).toHaveAttribute('data-empty', 'true')
      expect(item.querySelectorAll('.week-seg')).toHaveLength(0)
    }
    expect(screen.getByText('Monday: 0 tasks, 0 practice sessions')).toBeInTheDocument()
  })

  it('reads singular and plural counts exactly', () => {
    render(<WeekStrip days={week([[1, 1], [2, 2]])} today="2026-11-16" />)

    expect(screen.getByText('Monday: 1 task, 1 practice session')).toBeInTheDocument()
    expect(screen.getByText('Tuesday: 2 tasks, 2 practice sessions')).toBeInTheDocument()
  })
})
