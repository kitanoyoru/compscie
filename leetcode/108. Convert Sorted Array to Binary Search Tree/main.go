package main

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func sortedArrayToBST(nums []int) *TreeNode {
	if len(nums) == 0 {
		return nil
	}
	if len(nums) == 1 {
		return &TreeNode{Val: nums[0]}
	}

	mid := int(math.Ceil(float64(len(nums) / 2)))

	node := &TreeNode { Val: nums[mid] }
	node.Left = sortedArrayToBST(nums[0:mid])
	node.Right = sortedArrayToBST(nums[mid+1:])

	return node
}
