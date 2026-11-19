import { describe, expect, it } from 'vitest'

import { addLocalDays, isCalendarDate, localDayKey, localDaysBetween, startOfLocalIsoWeek } from './calendar'

// The suite runs in America/Los_Angeles (see vitest.global-setup.ts).
describe('calendar', () => {
  it('runs in the pinned test time zone', () => {
    expect(new Date('2026-11-16T05:00:00Z').getHours()).toBe(21)
  })

  it('keys timestamps by the viewer local day', () => {
    expect(localDayKey('2026-11-16T05:00:00Z')).toBe('2026-11-15')
  })

  it('keeps repository calendar dates unchanged', () => {
    expect(localDayKey('2026-11-17')).toBe('2026-11-17')
  })

  it('returns undefined for unparsable values', () => {
    expect(localDayKey('not a date')).toBeUndefined()
    expect(localDayKey(new Date(Number.NaN))).toBeUndefined()
  })

  it('does not shift a calendar date used as a key', () => {
    expect(localDaysBetween('2026-11-17', new Date('2026-11-17T08:00:00Z'))).toBe(0)
  })

  it('recognises calendar dates', () => {
    expect(isCalendarDate('2026-11-17')).toBe(true)
    expect(isCalendarDate('2026-11-17T00:00:00Z')).toBe(false)
    expect(isCalendarDate('2026-02-31')).toBe(false)
  })

  it('starts the ISO week at local Monday midnight', () => {
    const start = startOfLocalIsoWeek(new Date('2026-11-17T06:00:00Z')) // Monday 22:00 PST

    expect(localDayKey(start)).toBe('2026-11-16')
    expect([start.getHours(), start.getMinutes()]).toEqual([0, 0])
  })

  it('keeps year-end days in the ISO week that started in December', () => {
    expect(localDayKey(startOfLocalIsoWeek(new Date(2026, 11, 31, 12)))).toBe('2026-12-28')
    expect(localDayKey(startOfLocalIsoWeek(new Date(2027, 0, 1, 12)))).toBe('2026-12-28')
  })

  it('counts calendar days across the DST change', () => {
    expect(localDaysBetween('2026-10-31', new Date('2026-11-02T20:00:00Z'))).toBe(2)
  })

  it('adds local days across the DST change without drifting off midnight', () => {
    const next = addLocalDays(new Date(2026, 9, 31), 2)

    expect(localDayKey(next)).toBe('2026-11-02')
    expect(next.getHours()).toBe(0)
  })
})
