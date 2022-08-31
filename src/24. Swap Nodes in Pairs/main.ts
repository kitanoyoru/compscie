// Solved by @kitanoyoru
// https://leetcode.com/problems/swap-nodes-in-pairs/

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

type Optional<T> = T | null;

const swapPairs = (head: Optional<ListNode>): Optional<ListNode> => {
    if (!head || !head.next) {
      return head;
    }

    let dummy = new ListNode(),
        prev = dummy,
        ptr = head;

    while (ptr && ptr.next) {
      prev.next = ptr.next;
      ptr.next = prev.next.next;
      prev.next.next = ptr;

      prev = ptr;
      ptr = ptr.next;
    }

    return dummy.next;
};
