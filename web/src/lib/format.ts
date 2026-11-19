const DAY_MS = 24 * 60 * 60 * 1000

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
const longDayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' })
const narrowWeekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'narrow', timeZone: 'UTC' })
const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

function toTime(value: Date | string): number {
  return typeof value === 'string' ? Date.parse(value) : value.getTime()
}

function utcMidnight(time: number): number {
  const date = new Date(time)

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/** `Nov 17`, or `Nov 17, 2025` outside the current year. Calendar days are read in UTC. */
export function formatDay(value: Date | string, now: Date = new Date()): string {
  const time = toTime(value)

  if (Number.isNaN(time)) {
    return ''
  }

  const sameYear = new Date(time).getUTCFullYear() === now.getUTCFullYear()

  return (sameYear ? dayFormatter : dayWithYearFormatter).format(time)
}

/** `Thursday, November 19` in the viewer's time zone. */
export function formatLongDay(value: Date): string {
  return longDayFormatter.format(value)
}

export function formatWeekday(day: string, style: 'short' | 'narrow' = 'short'): string {
  const time = Date.parse(day)

  return Number.isNaN(time) ? '' : (style === 'narrow' ? narrowWeekdayFormatter : weekdayFormatter).format(time)
}

/** Whole calendar days between two moments, compared as UTC days. */
export function daysBetween(value: Date | string, now: Date): number | undefined {
  const time = toTime(value)

  if (Number.isNaN(time)) {
    return undefined
  }

  return Math.round((utcMidnight(now.getTime()) - utcMidnight(time)) / DAY_MS)
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
