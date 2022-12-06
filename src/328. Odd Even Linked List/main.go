// Solved by @kitanoyoru

package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func oddEvenList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil || head.Next.Next == nil {
		return head
	}

	odd := head
	startOdd := odd

	even := head.Next
	startEven := even

	for odd != nil && even != nil && even.Next != nil {
		odd.Next = odd.Next.Next
		even.Next = even.Next.Next

		odd = odd.Next
		even = even.Next
	}

	odd.Next = startEven

	return startOdd
}
