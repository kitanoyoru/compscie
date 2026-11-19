/**
 * Viewer-local calendar helpers.
 *
 * Timestamps (`Date` or ISO strings with a time) are read in the viewer's time zone.
 * Repository calendar dates (`YYYY-MM-DD`) are already calendar days: they are never
 * parsed through `Date.parse`, which would read them as UTC midnight and shift them.
 */

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 24 * 60 * 60 * 1000

function pad(part: number, width = 2): string {
  return String(part).padStart(width, '0')
}

/** `YYYY-MM-DD` from the local date parts of a valid `Date`. */
export function dayKeyOf(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Local midnight of a `YYYY-MM-DD` calendar date, or `undefined` if it is not a real date. */
function parseCalendarDate(value: string): Date | undefined {
  const [year, month, day] = value.split('-').map(Number)

  if (year === undefined || month === undefined || day === undefined) {
    return undefined
  }

  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined
}

/** True for a real `YYYY-MM-DD` calendar date (`2026-02-31` is not). */
export function isCalendarDate(value: string): boolean {
  return CALENDAR_DATE.test(value) && parseCalendarDate(value) !== undefined
}

/**
 * Returns `YYYY-MM-DD` from local date parts. A calendar date is returned unchanged.
 * An unparsable value returns `undefined`.
 */
export function localDayKey(value: Date | string): string | undefined {
  if (typeof value === 'string' && isCalendarDate(value)) {
    return value
  }

  const time = typeof value === 'string' ? Date.parse(value) : value.getTime()

  return Number.isNaN(time) ? undefined : dayKeyOf(new Date(time))
}

/** Local Monday 00:00 of the ISO week containing `now`. */
export function startOfLocalIsoWeek(now: Date): Date {
  const daysSinceMonday = (now.getDay() + 6) % 7

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday)
}

/** Local midnight `days` calendar days after the local day of `date`. DST safe. */
export function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/**
 * Whole local calendar days from `from` to `to` (positive when `to` is later).
 * Compared through `Date.UTC` of the local parts, so a 23 or 25 hour day counts as one day.
 */
export function localDaysBetween(from: Date | string, to: Date): number | undefined {
  const fromKey = localDayKey(from)
  const toKey = localDayKey(to)

  if (fromKey === undefined || toKey === undefined) {
    return undefined
  }

  const fromDay = parseCalendarDate(fromKey)

  if (fromDay === undefined) {
    return undefined
  }

  const utc = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.round((utc(to) - utc(fromDay)) / DAY_MS)
}
