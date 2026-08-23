// Solved by @kitanoyoru
// https://leetcode.com/problems/intersection-of-two-linked-lists/

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

type OptionalListNode = ListNode | null

const getLength = (head: OptionalListNode): number => {
  let fast = head
  let len = 0

  while (fast && fast.next) {
    fast = fast.next.next
    len += 2
  }

  return fast ? len + 1 : len
}

const getIntersectionNode = (
  headA: OptionalListNode,
  headB: OptionalListNode
): OptionalListNode => {
  let m = getLength(headA)
  let n = getLength(headB)

  let a = headA,
    b = headB

  while (m != n) {
    if (m > n) {
      m--
      a = a.next
    } else {
      n--
      b = b.next
    }
  }

  while (a && a != b) {
    a = a.next
    b = b.next
  }

  return a
}
