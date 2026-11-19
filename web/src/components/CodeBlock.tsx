import type { JSX, Ref } from 'react'

interface CodeBlockProps {
  /** Shiki HTML generated at build time from files in this repository (see scripts/content/). */
  readonly html: string
  /** Names the scrollable region, such as "Go solution, main.go". */
  readonly label: string
  readonly ref?: Ref<HTMLDivElement>
}

/**
 * Highlighted code in a focusable, labelled scroll region, so keyboard users can scroll it.
 * The HTML is trusted: it is produced at build time from the repository's own files, and Shiki
 * escapes the source text.
 */
export function CodeBlock({ html, label, ref }: CodeBlockProps): JSX.Element {
  return (
    <div
      ref={ref}
      className="code-block"
      role="region"
      aria-label={label}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
