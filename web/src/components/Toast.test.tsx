import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ToastProvider, useToast } from './Toast'

function Trigger({ onAction }: { readonly onAction?: () => void }) {
  const toast = useToast()

  return (
    <>
      <button
        type="button"
        onClick={() =>
          toast({
            message: 'First message',
            action: onAction === undefined ? undefined : { label: 'Undo', onAction },
          })
        }
      >
        first
      </button>
      <button type="button" onClick={() => toast({ message: 'Second message' })}>
        second
      </button>
    </>
  )
}

function setup(onAction?: () => void) {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

  render(
    <ToastProvider>
      <Trigger onAction={onAction} />
    </ToastProvider>,
  )

  return user
}

const region = () => screen.getByRole('status', { name: 'Notifications' })

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps an empty live region mounted', () => {
    setup()

    expect(region()).toHaveAttribute('aria-live', 'polite')
    expect(region()).toBeEmptyDOMElement()
  })

  it('auto-dismisses after 6000 ms', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'first' }))
    expect(region()).toHaveTextContent('First message')

    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(region()).toHaveTextContent('First message')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(region()).not.toHaveTextContent('First message')
  })

  it('pauses while hovered and resumes afterwards', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'first' }))
    await user.hover(screen.getByText('First message'))

    act(() => {
      vi.advanceTimersByTime(20000)
    })
    expect(region()).toHaveTextContent('First message')

    await user.unhover(screen.getByText('First message'))
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(region()).not.toHaveTextContent('First message')
  })

  it('dismisses on Escape', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'first' }))
    expect(region()).toHaveTextContent('First message')

    await user.keyboard('{Escape}')
    expect(region()).not.toHaveTextContent('First message')
  })

  it('replaces the old toast with a new one', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'first' }))
    await user.click(screen.getByRole('button', { name: 'second' }))

    expect(region()).toHaveTextContent('Second message')
    expect(region()).not.toHaveTextContent('First message')
  })

  it('runs the action and dismisses', async () => {
    const onAction = vi.fn()
    const user = setup(onAction)
    await user.click(screen.getByRole('button', { name: 'first' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(region()).not.toHaveTextContent('First message')
  })
})
