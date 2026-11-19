import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · Compscie`
  }, [title])
}

export function RouteFocus(): null {
  const { pathname } = useLocation()
  const previous = useRef<string | null>(null)

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname) {
      document.documentElement.scrollTop = 0
      document.querySelector<HTMLElement>('#app-main h1')?.focus()
    }
    previous.current = pathname
  }, [pathname])

  return null
}
