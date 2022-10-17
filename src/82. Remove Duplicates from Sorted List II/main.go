// Solved by @kitanoyoru
// https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/

/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

func deleteDuplicates(head *ListNode) *ListNode {
  if head == nil {
    return head
  }

  temp := &ListNode{0, head}
  curr, prev := head, temp

  for curr != nil {
    if curr.Next != nil && curr.Val == curr.Next.Val {
      curr = curr.Next
      continue
    }

    if prev.Next != curr {
      prev.Next = curr.Next
    } else {
      prev = prev.Next
    }

    curr = curr.Next
  }

  return temp.Next
}
