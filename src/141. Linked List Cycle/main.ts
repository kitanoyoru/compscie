// Solved by @kitanoyoru
// https://leetcode.com/problems/linked-list-cycle/

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

const hasCycle = (head: ListNode | null): boolean => {
  let nhead = head;

  while (nhead && nhead.next) {
    head = head.next;
    nhead = nhead.next.next;
    if (head == nhead) {
      return true;
    }
  }

  return false;
};
