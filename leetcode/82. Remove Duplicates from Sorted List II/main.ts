// Solved by @kitanoyoru
// https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/

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

type Optional<T> = T | null

const deleteDuplicates = (head: Optional<ListNode>): Optional<ListNode> => {
  const map = new Map<number, number>()

  let ptr = head
  while (ptr) {
    if (map.has(ptr.val)) {
      map.set(ptr.val, map.get(ptr.val) + 1)
    } else {
      map.set(ptr.val, 1)
    }
    ptr = ptr.next
  }

  let temp = new ListNode()
  ptr = temp
  for (const [key, val] of map.entries()) {
    if (val == 1) {
      ptr.next = new ListNode(key)
      ptr = ptr.next
    }
  }

  return temp.next
}
