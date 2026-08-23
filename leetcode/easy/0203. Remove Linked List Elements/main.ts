// Solved by @kitanoyoru
// https://leetcode.com/problems/remove-linked-list-elements/

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

const removeElements = (
  head: ListNode | null,
  val: number
): ListNode | null => {
  if (!head) {
    return null
  }

  let curr = head,
    prev: ListNode | null = null

  while (curr) {
    if (curr.val == val) {
      if (!prev) {
        head = head.next
        curr = head
      } else {
        prev.next = curr.next
        curr = curr.next
      }
    } else {
      prev = curr
      curr = curr.next
    }
  }

  return head
}
