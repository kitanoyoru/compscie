import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom does not implement the modal <dialog> API. This polyfill only sets `open`, moves focus
// and fires `close`. It does NOT emulate: the top layer, ::backdrop, inertness of the rest of
// the page, focus trapping, the native Escape key -> `cancel` event, or returning focus to the
// opener on close. Tests dispatch `cancel` and handle focus return explicitly.
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
    // Browsers move focus into the dialog; keyboard events then target it.
    this.querySelector<HTMLElement>('button, input, select, textarea, [href], [tabindex]')?.focus()
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) {
      return
    }

    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

afterEach(() => {
  cleanup()
})
