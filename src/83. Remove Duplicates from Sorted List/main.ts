// Solved by @kitanoyoru
// https://leetcode.com/problems/remove-duplicates-from-sorted-list/

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

interface HashMap {
  [key: number]: boolean
}

const deleteDuplicates = (head: ListNode | null): ListNode | null => {
  let hm: HashMap = {};
  let curr = head, prev: ListNode | null = null;

  while (curr) {
    if (!hm[curr.val]) {
      hm[curr.val] = true;
      prev = curr;
    } else {
      prev.next = curr.next;
    }
    curr = curr.next;
  }

  return head;
};
