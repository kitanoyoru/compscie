// Solved by @kitanoyoru
// https://leetcode.com/problems/remove-nth-node-from-end-of-list/

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

const removeNthFromEnd = (head: ListNode | null, n: number): ListNode | null => {
  let curr = head, length = 0, pos;

  while (curr) {
    curr = curr.next;
    length++;
  }

  if (length == 1) {
    return null;
  }
  if (length == n) {
    return head.next;
  }

  pos = length - n;
  curr = head;

  while (pos-- != 1) {
    curr = curr.next;
  }

  curr.next = curr.next.next;

  return head;
};
