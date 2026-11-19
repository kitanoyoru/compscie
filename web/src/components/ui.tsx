import type { JSX, ReactNode } from 'react'

import type { Difficulty } from '../data/types'
import type { ProblemProgress } from '../domain/insights'
import { Icon } from './Icon'

const numberFormatter = new Intl.NumberFormat()

export function formatCount(value: number): string {
  return numberFormatter.format(value)
}

interface PageHeaderProps {
  readonly eyebrow?: ReactNode
  readonly title: string
  readonly titleId: string
  readonly description?: ReactNode
  readonly aside?: ReactNode
}

export function PageHeader({ eyebrow, title, titleId, description, aside }: PageHeaderProps): JSX.Element {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow !== undefined && <p className="eyebrow">{eyebrow}</p>}
        <h1 id={titleId} tabIndex={-1}>{title}</h1>
        {description !== undefined && <p className="page-description">{description}</p>}
      </div>
      {aside !== undefined && <div className="page-header-aside">{aside}</div>}
    </header>
  )
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function DifficultyBadge({ difficulty }: { readonly difficulty: Difficulty }): JSX.Element {
  return (
    <span className="badge" data-difficulty={difficulty}>
      <span className="swatch" aria-hidden="true" />
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  )
}

export function ProgressBadge({ progress }: { readonly progress: ProblemProgress }): JSX.Element | null {
  if (progress === 'success') {
    return (
      <span className="badge" data-status="good">
        <Icon name="check" size={14} />
        Solved
      </span>
    )
  }

  if (progress === 'needs-review') {
    return (
      <span className="badge" data-status="warning">
        <Icon name="rotate" size={14} />
        Needs review
      </span>
    )
  }

  return null
}

interface StatTileProps {
  readonly label: string
  readonly value: ReactNode
  readonly hint?: ReactNode
}

export function StatTile({ label, value, hint }: StatTileProps): JSX.Element {
  return (
    <div className="stat-tile">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint !== undefined && <p className="stat-hint">{hint}</p>}
    </div>
  )
}

interface EmptyStateProps {
  readonly title: string
  readonly children?: ReactNode
}

export function EmptyState({ title, children }: EmptyStateProps): JSX.Element {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      {children !== undefined && <div className="empty-state-body">{children}</div>}
    </div>
  )
}

interface ExternalLinkProps {
  readonly href: string
  readonly children: ReactNode
  readonly className?: string
}

export function ExternalLink({ href, children, className }: ExternalLinkProps): JSX.Element {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <Icon name="external" size={14} className="icon-trailing" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
