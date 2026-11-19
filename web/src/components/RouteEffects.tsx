import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export function formatPageTitle(title: string): string {
  return `${title} · Compscie`
}

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = formatPageTitle(title)
  }, [title])
}

export function RouteFocus(): null {
  const { pathname } = useLocation()
  const previous = useRef<string | null>(null)

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname) {
      document.documentElement.scrollTop = 0
      // Every routed page renders its title through PageHeader's h1.
      document.querySelector<HTMLElement>('#app-main h1')?.focus()
    }
    previous.current = pathname
  }, [pathname])

  return null
}
