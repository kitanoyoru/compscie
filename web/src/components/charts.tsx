import type { CSSProperties, JSX, ReactNode } from 'react'
import { Link } from 'react-router'

import type { DayActivity } from '../domain/insights'
import { formatWeekday, plural } from '../lib/format'
import { formatCount } from './ui'

function ratioStyle(ratio: number): CSSProperties {
  return { '--ratio': Math.max(0, Math.min(1, ratio)) } as CSSProperties
}

export interface BarListItem {
  readonly label: string
  readonly value: number
  readonly to?: string
  /** Shown instead of the visible label; the label stays the accessible name and tooltip. */
  readonly icon?: ReactNode
  /** Sets `--lang-light` and `--lang-dark` to recolor this row's bar in each theme. */
  readonly colorStyle?: CSSProperties
}

function BarLabel({ item }: { readonly item: BarListItem }): JSX.Element {
  if (item.icon === undefined) {
    return item.to === undefined ? <>{item.label}</> : <Link to={item.to}>{item.label}</Link>
  }

  return item.to === undefined ? (
    <>
      {item.icon}
      <span className="sr-only">{item.label}</span>
    </>
  ) : (
    <Link to={item.to} aria-label={item.label}>
      {item.icon}
    </Link>
  )
}

interface BarListProps {
  readonly items: readonly BarListItem[]
  readonly label: string
  readonly unit: string
}

/** Single-series horizontal bars with the value printed at each bar's tip. */
export function BarList({ items, label, unit }: BarListProps): JSX.Element {
  const max = Math.max(1, ...items.map((item) => item.value))

  const withIcons = items.some((item) => item.icon !== undefined)

  return (
    <ul className={withIcons ? 'bar-list bar-list-icons' : 'bar-list'} aria-label={label}>
      {items.map((item) => (
        <li
          key={item.label}
          className="bar-row"
          title={`${item.label}: ${plural(item.value, unit)}`}
          style={item.colorStyle}
          data-colored={item.colorStyle === undefined ? undefined : true}
        >
          <span className="bar-label">
            <BarLabel item={item} />
          </span>
          <span className="bar-track">
            <span className="bar-fill" style={ratioStyle(item.value / max)} aria-hidden="true" />
            <span className="bar-value">
              {formatCount(item.value)}
              <span className="sr-only"> {item.value === 1 ? unit : `${unit}s`}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export interface Segment {
  readonly key: string
  readonly label: string
  readonly value: number
}

interface SegmentedBarProps {
  readonly segments: readonly Segment[]
  readonly label: string
}

/** One whole split into parts: a thin bar with a legend that names every part. */
export function SegmentedBar({ segments, label }: SegmentedBarProps): JSX.Element {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const share = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100))
  const description = segments.map((segment) => `${segment.label} ${formatCount(segment.value)}`).join(', ')

  return (
    <div className="segmented">
      <div className="segmented-bar" role="img" aria-label={`${label}: ${description}`}>
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <span
              key={segment.key}
              className="segment"
              data-difficulty={segment.key}
              style={{ flexGrow: segment.value }}
              title={`${segment.label}: ${formatCount(segment.value)} (${share(segment.value)}%)`}
            />
          ))}
      </div>
      <ul className="legend" aria-hidden="true">
        {segments.map((segment) => (
          <li key={segment.key}>
            <span className="swatch" data-difficulty={segment.key} />
            {segment.label}
            <span className="legend-value">{formatCount(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface WeekStripProps {
  readonly days: readonly DayActivity[]
  readonly today: string
}

/** Seven daily columns for the current ISO week: tasks and practice sessions stacked, today emphasized. */
export function WeekStrip({ days, today }: WeekStripProps): JSX.Element {
  const max = Math.max(1, ...days.map((day) => day.tasks + day.sessions))

  return (
    <div className="week">
      <ol className="week-strip" aria-label="Activity this week">
        {days.map((day) => {
          const total = day.tasks + day.sessions
          const summary = `${formatWeekday(day.date, 'long')}: ${plural(day.tasks, 'task')}, ${plural(day.sessions, 'practice session')}`

          return (
            <li
              key={day.date}
              className="week-day"
              data-today={day.date === today ? 'true' : undefined}
              data-empty={total === 0 ? 'true' : undefined}
            >
              <span className="week-bar-slot" aria-hidden="true">
                <span className="week-bar" style={ratioStyle(total / max)}>
                  {day.tasks > 0 && <span className="week-seg" data-series="tasks" style={{ flexGrow: day.tasks }} />}
                  {day.sessions > 0 && (
                    <span className="week-seg" data-series="sessions" style={{ flexGrow: day.sessions }} />
                  )}
                </span>
              </span>
              <span className="week-label" aria-hidden="true">
                {formatWeekday(day.date, 'narrow')}
              </span>
              <span className="sr-only">{summary}</span>
            </li>
          )
        })}
      </ol>
      <ul className="legend week-legend" aria-hidden="true">
        <li>
          <span className="swatch" data-series="tasks" aria-hidden="true" />
          Tasks
        </li>
        <li>
          <span className="swatch" data-series="sessions" aria-hidden="true" />
          Practice sessions
        </li>
      </ul>
    </div>
  )
}
