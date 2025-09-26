package main

import "math"

type ListNode struct {
	Val  int
	Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	dummy := new(ListNode)
	ptr := dummy

	var carry int

	var helper func(l1, l2 *ListNode)
	helper = func(l1, l2 *ListNode) {
		if l1 == nil && l2 == nil {
			return
		}

		value := carry
		if l1 != nil {
			value += l1.Val
		}
		if l2 != nil {
			value += l2.Val
		}

		carry = int(math.Floor(float64(value / 10)))

		node := &ListNode { Val: value % 10 }
		ptr.Next = node

		ptr = node

		var nl1, nl2 *ListNode
		if l1 != nil {
			nl1 = l1.Next
		}
		if l2 != nil {
			nl2 = l2.Next
		}

		helper(nl1, nl2)
	}

	helper(l1, l2)

	if carry != 0 {
		ptr.Next = &ListNode{Val: carry}
	}

	return dummy.Next
}
