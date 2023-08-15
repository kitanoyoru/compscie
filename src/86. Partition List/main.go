package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func NewListNode(val int) *ListNode {
	return &ListNode{
		Val: val,
	}
}

func partition(head *ListNode, x int) *ListNode {
	before, after := NewListNode(0), NewListNode(0)

	before_ptr, after_ptr := before, after

	for head != nil {
		if head.Val < x {
			before_ptr.Next = head
			before_ptr = before_ptr.Next
		} else {
			after_ptr.Next = head
			after_ptr = after_ptr.Next
		}

		head = head.Next
	}

	after_ptr.Next = nil
	before_ptr.Next = after.Next

	return before.Next
}
