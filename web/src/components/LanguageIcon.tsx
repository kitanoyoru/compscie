import type { CSSProperties, JSX } from 'react'

import languageIcons from '../data/language-icons.json'

export interface LanguageIconData {
  readonly path: string
  /** Tight box around the glyph, measured by scripts/vendor-language-icons.mjs. */
  readonly viewBox: string
  /** Box width over height, from 1 to 1.75; wide wordmarks such as Go render wider, not smaller. */
  readonly aspect: number
  readonly source: string
  /** Glyph color on light surfaces, at least 3:1 against every card surface. */
  readonly light: string
  /** Glyph color on dark surfaces, at least 3:1 against every card surface. */
  readonly dark: string
}

const ICONS: Readonly<Record<string, LanguageIconData>> = languageIcons

export function languageIconData(language: string): LanguageIconData | undefined {
  return Object.hasOwn(ICONS, language) ? ICONS[language] : undefined
}

/** CSS custom properties that color a language glyph or bar in both themes. */
export function languageColorStyle(language: string): CSSProperties | undefined {
  const data = languageIconData(language)

  return data === undefined
    ? undefined
    : ({ '--lang-light': data.light, '--lang-dark': data.dark } as CSSProperties)
}

function monogram(language: string): string {
  return language.replace(/[^A-Za-z0-9+#]/g, '').slice(0, 2) || '?'
}

interface LanguageIconProps {
  readonly language: string
  readonly size?: number
  /** Hide the icon from assistive technology because a parent already names the language. */
  readonly decorative?: boolean
  readonly className?: string
}

/** Brand mark of a programming language in its theme-safe color, with the name as a tooltip. */
export function LanguageIcon({ language, size = 16, decorative = false, className }: LanguageIconProps): JSX.Element {
  const data = languageIconData(language)
  const accessibility = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': language } as const)

  return (
    <span
      className={className === undefined ? 'lang-icon' : `lang-icon ${className}`}
      style={languageColorStyle(language)}
      title={language}
      data-language={language}
      {...accessibility}
    >
      {data === undefined ? (
        <span className="lang-monogram" style={{ width: size, height: size, fontSize: size * 0.5 }}>
          {monogram(language)}
        </span>
      ) : (
        <svg
          width={Math.round(size * data.aspect)}
          height={size}
          viewBox={data.viewBox}
          aria-hidden="true"
          focusable="false"
        >
          <path d={data.path} fill="currentColor" />
        </svg>
      )}
    </span>
  )
}

interface LanguageIconListProps {
  readonly languages: readonly string[]
  /** Icons shown before the rest collapse into "+N". */
  readonly max?: number
  readonly size?: number
  /** Hide the whole list from assistive technology because a parent already names the languages. */
  readonly decorative?: boolean
}

/** A row of language icons. Screen readers hear the full list of names. */
export function LanguageIconList({
  languages,
  max = 5,
  size = 16,
  decorative = false,
}: LanguageIconListProps): JSX.Element {
  const shown = languages.slice(0, max)
  const hidden = languages.slice(max)

  return (
    <span className="lang-icon-list" aria-hidden={decorative ? true : undefined}>
      {shown.map((language) => (
        <LanguageIcon key={language} language={language} size={size} decorative />
      ))}
      {hidden.length > 0 && (
        <span className="lang-more" title={hidden.join(', ')} aria-hidden="true">
          +{hidden.length}
        </span>
      )}
      {!decorative && <span className="sr-only">{languages.join(', ')}</span>}
    </span>
  )
}
