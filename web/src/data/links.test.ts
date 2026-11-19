import { describe, expect, it } from 'vitest'

import { leetcodeProblemUrl, leetcodeSlug, repositoryFileUrl, repositoryTreeUrl } from './links'

describe('repository links', () => {
  it('encodes each path segment for GitHub', () => {
    expect(repositoryTreeUrl('leetcode/easy/0001. Two Sum')).toBe(
      'https://github.com/kitanoyoru/compscie/tree/main/leetcode/easy/0001.%20Two%20Sum',
    )
    expect(repositoryFileUrl('notes/go/channels.md')).toBe(
      'https://github.com/kitanoyoru/compscie/blob/main/notes/go/channels.md',
    )
  })
})

describe('LeetCode slugs', () => {
  it.each([
    ['Two Sum', 'two-sum'],
    ['Pow(x, n)', 'powx-n'],
    ['Sqrt(x)', 'sqrtx'],
    ["Pascal's Triangle II", 'pascals-triangle-ii'],
    ['Insert Delete GetRandom O(1) - Duplicates allowed', 'insert-delete-getrandom-o1-duplicates-allowed'],
    ['All O`one Data Structure', 'all-oone-data-structure'],
    ['Element Appearing More Than 25% In Sorted Array', 'element-appearing-more-than-25-in-sorted-array'],
    ['Number of Ways to Paint N × 3 Grid', 'number-of-ways-to-paint-n-3-grid'],
    ['Apples & Oranges', 'apples-oranges'],
    ['The Knight’s Tour', 'the-knights-tour'],
    ['Is Array a Preorder of Some ‌Binary Tree', 'is-array-a-preorder-of-some-binary-tree'],
    ['Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values', 'maximize-y-sum-by-picking-a-triplet-of-distinct-x-values'],
  ])('derives %s', (title, slug) => {
    expect(leetcodeSlug(title)).toBe(slug)
  })

  it('builds the problem URL', () => {
    expect(leetcodeProblemUrl({ title: 'Two Sum' })).toBe('https://leetcode.com/problems/two-sum/')
  })
})
