// WCAG contrast helpers shared by the build scripts (icon vendoring and code highlighting).

function channel(value) {
  const unit = value / 255

  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

/** `#rgb`, `#rrggbb`, or `#rrggbbaa` (alpha dropped) as uppercase `#RRGGBB`. */
export function normalizeHex(hex) {
  const value = hex.trim().replace(/^#/, '')

  if (/^[0-9a-f]{3}$/i.test(value)) {
    return `#${[...value].map((digit) => digit + digit).join('')}`.toUpperCase()
  }

  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)) {
    return `#${value.slice(0, 6)}`.toUpperCase()
  }

  throw new Error(`Not a hex color: ${hex}`)
}

export function relativeLuminance(hex) {
  const value = Number.parseInt(normalizeHex(hex).slice(1), 16)

  return 0.2126 * channel((value >> 16) & 0xff) + 0.7152 * channel((value >> 8) & 0xff) + 0.0722 * channel(value & 0xff)
}

export function contrastRatio(left, right) {
  const [lighter, darker] = [relativeLuminance(left), relativeLuminance(right)].sort((a, b) => b - a)

  return (lighter + 0.05) / (darker + 0.05)
}

function hexToHsl(hex) {
  const value = Number.parseInt(normalizeHex(hex).slice(1), 16)
  const red = ((value >> 16) & 0xff) / 255
  const green = ((value >> 8) & 0xff) / 255
  const blue = (value & 0xff) / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2

  if (max === min) {
    return [0, 0, lightness]
  }

  const delta = max - min
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  const hue =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4

  return [hue / 6, saturation, lightness]
}

function hslToHex([hue, saturation, lightness]) {
  const toChannel = (offset) => {
    const k = (offset + hue * 12) % 12
    const a = saturation * Math.min(lightness, 1 - lightness)
    const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))

    return Math.round(value * 255)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${toChannel(0)}${toChannel(8)}${toChannel(4)}`.toUpperCase()
}

/**
 * Steps HSL lightness by 2% toward black (`darker`) or white (`lighter`) until the color reaches
 * `minimum` contrast against every background. Returns the original color when it already does.
 */
export function adjustForContrast(hex, backgrounds, direction, minimum) {
  const [hue, saturation, startLightness] = hexToHsl(hex)
  let lightness = startLightness
  let candidate = normalizeHex(hex)

  while (backgrounds.some((background) => contrastRatio(candidate, background) < minimum)) {
    lightness += direction === 'darker' ? -0.02 : 0.02

    if (lightness < 0 || lightness > 1) {
      throw new Error(`Cannot reach ${minimum}:1 for ${hex} by going ${direction}`)
    }

    candidate = hslToHex([hue, saturation, lightness])
  }

  return candidate
}
