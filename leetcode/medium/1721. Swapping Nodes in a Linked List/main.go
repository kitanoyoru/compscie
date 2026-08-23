package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func swapNodes(head *ListNode, k int) *ListNode {
	left, run, right := head, head, head
	for i := 0; i < k-1; i++ {
		run = run.Next
	}

	left = run
	for ; run.Next != nil; run = run.Next {
		right = right.Next
	}

	left.Val, right.Val = right.Val, left.Val

	return head
}
