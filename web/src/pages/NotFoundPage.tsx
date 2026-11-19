import type { JSX } from 'react'
import { Link } from 'react-router'

import { usePageTitle } from '../components/RouteEffects'
import { PageHeader } from '../components/ui'

export function NotFoundPage(): JSX.Element {
  usePageTitle('Page not found')

  return (
    <div className="page">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        titleId="not-found-heading"
        description="That page does not exist in this workspace."
      />
      <p>
        <Link to="/" className="button">
          Back to Today
        </Link>
      </p>
    </div>
  )
}
