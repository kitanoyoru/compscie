// Solved by @kitanoyoru
// https://leetcode.com/problems/add-two-numbers/

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

const addTwoNumbers = (l1: ListNode | null, l2: ListNode | null): ListNode | null => {
  const temp = new ListNode();
  let ptr = temp;

  let carry = 0;

  const helper = (l1: ListNode | null, l2: ListNode | null) => {
    if (!l1 && !l2) {
      return;
    }

    const n1 = l1 != null ? l1.val : 0;
    const n2 = l2 != null ? l2.val : 0;

    const sum = n1 + n2 + carry;
    carry = Math.floor(sum / 10);

    const newNode = new ListNode(sum % 10);

    ptr.next = newNode;
    ptr = ptr.next;

    l1 = l1 != null ? l1.next : l1;
    l2 = l2 != null ? l2.next : l2;

    helper(l1, l2);
  };

  helper(l1, l2);

  if (carry) {
    ptr.next = new ListNode(carry);
  }

  return temp.next;
};

