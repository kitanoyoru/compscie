import { describe, expect, it } from 'vitest'

import { daysBetween, parseMinutes, formatDay, formatRelativeDay, formatWeekday } from './format'

// The suite runs in America/Los_Angeles (see src/test/setup.ts).
const now = new Date('2026-11-19T18:00:00Z')

describe('formatDay', () => {
  it('renders a repository calendar date as that exact day', () => {
    expect(formatDay('2026-11-17', now)).toBe('Nov 17')
  })

  it('renders a timestamp in the viewer time zone', () => {
    expect(formatDay('2026-11-17T00:00:00.000Z', now)).toBe('Nov 16')
  })

  it('adds the year outside the current local year', () => {
    expect(formatDay('2025-12-31', now)).toBe('Dec 31, 2025')
    expect(formatDay('2026-01-01', new Date('2026-01-01T03:00:00Z'))).toBe('Jan 1, 2026')
    expect(formatDay('2026-01-01', new Date('2026-01-01T09:00:00Z'))).toBe('Jan 1')
  })
})

describe('formatWeekday', () => {
  it('names the weekday of a calendar day key', () => {
    expect(formatWeekday('2026-11-16')).toBe('Mon')
  })
})

describe('daysBetween and formatRelativeDay', () => {
  it('counts a calendar date against the local today', () => {
    expect(daysBetween('2026-11-17', now)).toBe(2)
    expect(formatRelativeDay('2026-11-19', now)).toBe('today')
  })

  it('uses the local day for timestamps', () => {
    // Thursday 04:00Z is still Wednesday evening in Los Angeles.
    expect(formatRelativeDay('2026-11-19T04:00:00Z', now)).toBe('yesterday')
  })
})

describe('parseMinutes', () => {
  it('parses positive finite numbers', () => {
    expect(parseMinutes('25')).toBe(25)
    expect(parseMinutes(' 7.5 ')).toBe(7.5)
  })

  it.each(['', '   ', '0', '-5', 'abc', 'Infinity'])('rejects %j', (raw) => {
    expect(parseMinutes(raw)).toBeUndefined()
  })
})
