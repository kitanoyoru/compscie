function channel(value: number): number {
  const unit = value / 255

  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of a `#rrggbb` color. */
export function relativeLuminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error(`Expected a #rrggbb color, got ${hex}`)
  }

  const value = Number.parseInt(hex.slice(1), 16)

  return 0.2126 * channel((value >> 16) & 0xff) + 0.7152 * channel((value >> 8) & 0xff) + 0.0722 * channel(value & 0xff)
}

/** WCAG 2.x contrast ratio between two `#rrggbb` colors, from 1 to 21. */
export function contrastRatio(left: string, right: string): number {
  const [lighter, darker] = [relativeLuminance(left), relativeLuminance(right)].sort((a, b) => b - a) as [
    number,
    number,
  ]

  return (lighter + 0.05) / (darker + 0.05)
}
