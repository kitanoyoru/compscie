import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type PropsWithChildren,
} from 'react'

export const TOAST_DURATION_MS = 6000

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

  const show = useCallback<ShowToast>((toast) => {
    nextId.current += 1
    setPaused(false)
    setActive({ ...toast, id: nextId.current })
  }, [])

  const dismiss = useCallback(() => setActive(null), [])

  const toastId = active?.id

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
      if (event.key === 'Escape') {
        dismiss()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toastId, dismiss])

  const action = active?.action
  const handleAction = useMemo(
    () =>
      action === undefined
        ? undefined
        : () => {
            action.onAction()
            dismiss()
          },
    [action, dismiss],
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite" aria-label="Notifications">
        {active !== undefined && active !== null && (
          <div
            key={active.id}
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
            {active.action !== undefined && handleAction !== undefined && (
              <button type="button" className="toast-action" onClick={handleAction}>
                {active.action.label}
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
