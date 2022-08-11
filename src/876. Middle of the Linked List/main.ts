// Solved by @kitanoyoru
// https://leetcode.com/problems/middle-of-the-linked-list/

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

const middleNode = (head: ListNode | null): ListNode | null => {
  let curr = head, length = 0, mid = 0;

  while (curr.next) {
    curr = curr.next;
    length++;
  }
  
  mid = Math.ceil(length / 2);
  curr = head;

  while (mid--) {
    curr = curr.next;
  }

  return curr
};
