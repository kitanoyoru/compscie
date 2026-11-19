import { describe, expect, it } from 'vitest'

import { repositorySnapshot } from '../data/generated/repository'
import { PAGE_ITEMS, scoreToken, search, sectionItems, snapshotItems, type SearchItem } from './search'

const actions: SearchItem[] = [
  { id: 'action:theme', kind: 'action', title: 'Switch to dark theme', run: () => undefined },
  { id: 'action:settings', kind: 'action', title: 'Open settings', run: () => undefined },
]
const sections = sectionItems(
  [
    {
      topicSlug: 'go',
      slug: 'channels',
      headings: [
        { id: 'hchan-struct', text: 'hchan struct' },
        { id: 'who-closes-a-channel', text: 'Who closes a channel' },
      ],
    },
    { topicSlug: 'go', slug: 'missing-note', headings: [{ id: 'x', text: 'Channel ghosts' }] },
  ],
  repositorySnapshot.notes,
)
const items = [...PAGE_ITEMS, ...actions, ...snapshotItems(repositorySnapshot), ...sections]
const ids = (results: readonly SearchItem[]) => results.map((item) => item.id)

describe('scoreToken', () => {
  it('prefers a prefix, then a word start, then any substring, then a subsequence', () => {
    const prefix = scoreToken('chan', 'Channels')!
    const wordStart = scoreToken('chan', 'Go Channels')!
    const inside = scoreToken('chan', 'hchan struct')!
    const scattered = scoreToken('gc', 'Go Channels')!

    expect(prefix).toBeGreaterThan(wordStart)
    expect(wordStart).toBeGreaterThan(inside)
    expect(inside).toBeGreaterThan(scattered)
    expect(scoreToken('zz', 'Go Channels')).toBeUndefined()
  })
})

describe('search', () => {
  it('lists pages and actions for an empty query', () => {
    expect(ids(search(items, '  '))).toEqual([...PAGE_ITEMS, ...actions].map((item) => item.id))
  })

  it('finds problems by number, the exact number first', () => {
    const results = search(items, '#1')

    expect(results[0]).toMatchObject({ kind: 'problem', problemId: 1, title: 'Two Sum' })
    expect(results.every((item) => String(item.problemId).startsWith('1'))).toBe(true)
    expect(search(items, '1')[0]?.problemId).toBe(1)
  })

  it('ranks the Go Channels note above sections that mention channels', () => {
    const results = search(items, 'chan')
    const note = results.findIndex((item) => item.id === 'note:notes/go/channels.md')
    const section = results.findIndex((item) => item.id === 'section:go/channels#hchan-struct')

    expect(note).toBeGreaterThanOrEqual(0)
    expect(section).toBeGreaterThan(note)
    expect(results.find((item) => item.id === 'section:go/channels#hchan-struct')).toMatchObject({
      subtitle: 'Go Channels',
      to: '/notes/go/channels?section=hchan-struct',
    })
  })

  it('finds the scheduler note by its acronym', () => {
    expect(search(items, 'gmp')[0]).toMatchObject({ kind: 'note', to: '/notes/go/scheduler-gmp' })
  })

  it('needs every word to match, in any order', () => {
    expect(search(items, 'sum two').map((item) => item.title)).toContain('Two Sum')
    expect(search(items, 'two zzzz')).toEqual([])
  })

  it('caps the number of results', () => {
    expect(search(items, 'e').length).toBeLessThanOrEqual(50)
  })

  it('skips sections of notes that are not in the snapshot', () => {
    expect(sections.some((item) => item.title === 'Channel ghosts')).toBe(false)
  })
})
