import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type JSX,
  type PropsWithChildren,
} from 'react'

import { isModalOpen, isTypingTarget } from '../lib/keyboard'

export const TOAST_DURATION_MS = 6000

function undoHint(): string {
  const platform = typeof navigator === 'undefined' ? '' : `${navigator.platform} ${navigator.userAgent}`

  return /mac|iphone|ipad/i.test(platform) ? '⌘Z' : 'Ctrl+Z'
}

export interface ToastOptions {
  readonly message: string
  readonly action?: { readonly label: string; readonly onAction: () => void }
}

type ShowToast = (toast: ToastOptions) => void

interface ActiveToast extends ToastOptions {
  readonly id: number
}

const ToastContext = createContext<ShowToast | null>(null)

export function ToastProvider({ children }: PropsWithChildren): JSX.Element {
  const [active, setActive] = useState<ActiveToast | null>(null)
  const [paused, setPaused] = useState(false)
  const nextId = useRef(0)
  const toastRef = useRef<HTMLDivElement>(null)

  const show = useCallback<ShowToast>((toast) => {
    nextId.current += 1
    setPaused(false)
    setActive({ ...toast, id: nextId.current })
  }, [])

  const dismiss = useCallback(() => setActive(null), [])

  const toastId = active?.id
  const action = active?.action

  const toastHasFocus = useCallback(() => toastRef.current?.contains(document.activeElement) === true, [])

  // The focused toast button disappears with the toast; hand focus to the main region.
  const restoreFocus = useCallback((hadFocus: boolean) => {
    if (hadFocus) {
      document.getElementById('app-main')?.focus()
    }
  }, [])

  const runAction = useCallback(() => {
    if (action === undefined) {
      return
    }

    const hadFocus = toastHasFocus()

    action.onAction()
    dismiss()
    restoreFocus(hadFocus)
  }, [action, dismiss, toastHasFocus, restoreFocus])

  useEffect(() => {
    if (toastId === undefined || paused) {
      return undefined
    }

    const timer = window.setTimeout(dismiss, TOAST_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [toastId, paused, dismiss])

  useEffect(() => {
    if (toastId === undefined) {
      return undefined
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || isModalOpen()) {
        return
      }

      if (event.key === 'Escape') {
        const hadFocus = toastHasFocus()

        dismiss()
        restoreFocus(hadFocus)
        return
      }

      if (
        action !== undefined &&
        event.key.toLowerCase() === 'z' &&
        (event.ctrlKey || event.metaKey) &&
        !(event.ctrlKey && event.metaKey) &&
        !event.shiftKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault()
        runAction()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toastId, action, dismiss, runAction, toastHasFocus, restoreFocus])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite" aria-label="Notifications" aria-atomic="true">
        {active !== undefined && active !== null && (
          <div
            key={active.id}
            ref={toastRef}
            className="toast"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setPaused(false)
              }
            }}
          >
            <span className="toast-message">{active.message}</span>
            {active.action !== undefined && (
              <button
                type="button"
                className="toast-action"
                aria-keyshortcuts="Control+Z Meta+Z"
                onClick={runAction}
              >
                {active.action.label}
                <kbd className="toast-kbd" aria-hidden="true">
                  {undoHint()}
                </kbd>
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext)

  if (show === null) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return show
}
