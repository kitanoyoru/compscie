package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func reverseBetween(head *ListNode, left int, right int) *ListNode {
	dummy := &ListNode{
		Next: head,
	}
	prev := dummy

	for i := 0; i < left-1; i++ {
		prev = prev.Next
	}

	curr := prev.Next

	for i := 0; i < right-left; i++ {
		next := curr.Next
		curr.Next, next.Next, prev.Next = next.Next, prev.Next, next
	}

	return dummy.Next
}
