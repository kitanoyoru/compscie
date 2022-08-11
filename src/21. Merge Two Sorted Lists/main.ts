// Solved by @kitanoyoru
// https://leetcode.com/problems/merge-two-sorted-lists/

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


// solution 1 
const mergeTwoLists = (list1: ListNode | null, list2: ListNode | null): ListNode | null => {
  if (!list1) {
    return list2;
  }
  if (!list2) {
    return list1;
  }
  
  if (list1.val <= list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoLists(list1, list2.next);
    return list2;
  }
};



// solution 2
const mergeTwoLists = (list1: ListNode | null, list2: ListNode | null): ListNode | null => {
  if (!list1) {
    return list2;
  }
  if (!list2) {
    return list1;
  }

  let mergedList: ListNode;
  
  if (list1.val < list2.val) {
    mergedList = list1;
    list1 = list1.next;
  } else {
    mergedList = list2;
    list2 = list2.next;
  }

  let curr = mergedList;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      curr.next = list1;
      curr = curr.next;
      list1 = list1.next;
    } else {
      curr.next = list2;
      curr = curr.next;
      list2 = list2.next;
    }
  }

  if (list1) {
    curr.next = list1;
  } else if (list2) {
    curr.next = list2;
  }

  return mergedList;
};
