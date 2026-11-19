import { describe, expect, it } from 'vitest'

import { isTypingTarget } from './keyboard'

describe('isTypingTarget', () => {
  it('is true for inputs, textareas, selects and contenteditable', () => {
    const editable = document.createElement('div')
    editable.setAttribute('contenteditable', 'true')

    expect(isTypingTarget(document.createElement('input'))).toBe(true)
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true)
    expect(isTypingTarget(document.createElement('select'))).toBe(true)
    expect(isTypingTarget(editable)).toBe(true)
  })

  it('is false for other elements, document and null', () => {
    expect(isTypingTarget(document.createElement('button'))).toBe(false)
    expect(isTypingTarget(document.createElement('div'))).toBe(false)
    expect(isTypingTarget(document)).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})
