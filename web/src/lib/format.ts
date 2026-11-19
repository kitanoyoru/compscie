import { isCalendarDate, localDaysBetween } from './calendar'

const dayFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const dayWithYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const localDayFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const localDayWithYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const longDayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' })
const narrowWeekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'narrow', timeZone: 'UTC' })
const longWeekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' })
const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

function toTime(value: Date | string): number {
  return typeof value === 'string' ? Date.parse(value) : value.getTime()
}

/**
 * `Nov 17`, or `Nov 17, 2025` outside the current year.
 * A `YYYY-MM-DD` calendar date is formatted as that exact day in every time zone.
 * Any other timestamp is formatted in the viewer's time zone.
 */
export function formatDay(value: Date | string, now: Date = new Date()): string {
  if (typeof value === 'string' && isCalendarDate(value)) {
    const time = Date.parse(value)

    if (Number.isNaN(time)) {
      return ''
    }

    const sameYear = new Date(time).getUTCFullYear() === now.getFullYear()

    return (sameYear ? dayFormatter : dayWithYearFormatter).format(time)
  }

  const time = toTime(value)

  if (Number.isNaN(time)) {
    return ''
  }

  const sameYear = new Date(time).getFullYear() === now.getFullYear()

  return (sameYear ? localDayFormatter : localDayWithYearFormatter).format(time)
}

/** Local time such as `9:05 AM`, in the viewer's time zone. */
export function formatTime(value: Date | string): string {
  const time = toTime(value)

  return Number.isNaN(time) ? '' : timeFormatter.format(time)
}

/** `Thursday, November 19` in the viewer's time zone. */
export function formatLongDay(value: Date): string {
  return longDayFormatter.format(value)
}

export function formatWeekday(day: string, style: 'short' | 'narrow' | 'long' = 'short'): string {
  const time = Date.parse(day)
  const formatter =
    style === 'narrow' ? narrowWeekdayFormatter : style === 'long' ? longWeekdayFormatter : weekdayFormatter

  return Number.isNaN(time) ? '' : formatter.format(time)
}

/** Whole calendar days from `value` to `now`, in the viewer's time zone. Calendar dates never shift. */
export function daysBetween(value: Date | string, now: Date): number | undefined {
  return localDaysBetween(value, now)
}

/** `today`, `yesterday`, `5 days ago`, `3 months ago`. */
export function formatRelativeDay(value: Date | string, now: Date = new Date()): string {
  const days = daysBetween(value, now)

  if (days === undefined) {
    return ''
  }

  if (Math.abs(days) < 60) {
    return relativeFormatter.format(-days, 'day')
  }

  return relativeFormatter.format(-Math.round(days / 30), 'month')
}

/** `04:09`, or `1:04:09` past an hour. */
export function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (part: number) => String(part).padStart(2, '0')

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

export function formatProblemNumber(id: number): string {
  return String(id).padStart(4, '0')
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/** Drops decorative leading symbols such as emoji from a note title. */
export function cleanTitle(title: string): string {
  return title.replace(/^[^\p{L}\p{N}]+/u, '').trim() || title
}

/** Parses a minutes field. Returns a positive finite number, or `undefined` when blank or invalid. */
export function parseMinutes(raw: string): number | undefined {
  if (raw.trim() === '') {
    return undefined
  }

  const minutes = Number(raw)

  return Number.isFinite(minutes) && minutes > 0 ? minutes : undefined
}
