// Solved by @kitanoyoru

package main

import (
	"math"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

func middleNode(head *ListNode) *ListNode {
	var cur = head

	length := 0.0

	for cur.Next != nil {
		length++
		cur = cur.Next
	}

	mid := math.Ceil(length / 2)
	cur = head

	for ; mid != 0; mid-- {
		cur = cur.Next

	}

	return cur
}
