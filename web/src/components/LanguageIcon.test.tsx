import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LanguageIcon, LanguageIconList } from './LanguageIcon'

describe('LanguageIcon', () => {
  it('names the language and carries its theme colors', () => {
    render(<LanguageIcon language="Go" />)

    const icon = screen.getByRole('img', { name: 'Go' })
    expect(icon).toHaveAttribute('title', 'Go')
    expect(icon.style.getPropertyValue('--lang-light')).toMatch(/^#[0-9A-F]{6}$/)
    expect(icon.style.getPropertyValue('--lang-dark')).toMatch(/^#[0-9A-F]{6}$/)
    expect(icon.querySelector('svg path')).toHaveAttribute('fill', 'currentColor')
  })

  it('renders a wide wordmark wider instead of smaller', () => {
    render(<LanguageIcon language="Go" size={16} />)

    const svg = screen.getByRole('img', { name: 'Go' }).querySelector('svg')
    expect(svg).toHaveAttribute('height', '16')
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(16)
  })

  it('falls back to a monogram for a language without an icon', () => {
    render(<LanguageIcon language="Brainfuck" />)

    expect(screen.getByRole('img', { name: 'Brainfuck' })).toHaveTextContent('Br')
  })

  it('hides a decorative icon from assistive technology', () => {
    const { container } = render(<LanguageIcon language="Rust" decorative />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('.lang-icon')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('LanguageIconList', () => {
  const languages = ['C++', 'Go', 'Java', 'Python', 'Rust', 'Swift', 'TypeScript']

  it('shows the first icons, collapses the rest, and names every language', () => {
    const { container } = render(<LanguageIconList languages={languages} max={5} />)

    expect(container.querySelectorAll('.lang-icon')).toHaveLength(5)
    expect(container.querySelector('.lang-more')).toHaveTextContent('+2')
    expect(container.querySelector('.lang-more')).toHaveAttribute('title', 'Swift, TypeScript')
    expect(screen.getByText(languages.join(', '))).toHaveClass('sr-only')
  })

  it('renders nothing for assistive technology when decorative', () => {
    const { container } = render(<LanguageIconList languages={languages} decorative />)

    expect(container.querySelector('.lang-icon-list')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.sr-only')).toBeNull()
  })
})
