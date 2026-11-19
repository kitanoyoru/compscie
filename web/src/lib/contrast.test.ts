import { describe, expect, it } from 'vitest'

import { contrastRatio, relativeLuminance } from './contrast'

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#777777', '#777777')).toBe(1)
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2)
  })

  it('is symmetric', () => {
    expect(contrastRatio('#256abf', '#fcfcfb')).toBe(contrastRatio('#fcfcfb', '#256abf'))
  })

  it('rejects anything but #rrggbb', () => {
    expect(() => relativeLuminance('#fff')).toThrow(/#rrggbb/)
  })
})
