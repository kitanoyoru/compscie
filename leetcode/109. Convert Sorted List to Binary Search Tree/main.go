package main

type ListNode struct {
	Val  int
	Next *ListNode
}

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func sortedListToBST(head *ListNode) *TreeNode {
	if head == nil { return nil }
	if head.Next == nil { return &TreeNode{ Val: head.Val } }

	slow, fast := head, head

	mid := slow

	for fast != nil && fast.Next != nil {
		mid = slow
		fast = fast.Next.Next
		slow = slow.Next
	}

	node := &TreeNode { Val: slow.Val }

	mid.Next = nil

	node.Left = sortedListToBST(head)
	node.Right = sortedListToBST(slow.Next)

	return node
}

