// Solved by @kitanoyoru
// https://leetcode.com/problems/palindrome-linked-list/

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// 1 2 1 2 3

const isPalindrome = (head: ListNode | null): boolean => {
  const nodes: number[] = []

  while (head) {
    nodes.push(head.val)
    head = head.next
  }

  const n = nodes.length
  const half = Math.floor(n / 2)

  for (let i = 0; i < half; i++) {
    if (nodes[i] != nodes[n - 1 - i]) {
      return false
    }
  }

  return true
}
