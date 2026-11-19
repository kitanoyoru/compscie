/** True when the target is a field where keystrokes (and native undo) belong to the user. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable ||
    target.getAttribute('contenteditable') === '' ||
    target.getAttribute('contenteditable') === 'true'
  )
}
