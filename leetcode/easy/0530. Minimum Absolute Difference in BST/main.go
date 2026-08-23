package main

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func getMinimumDifference(root *TreeNode) int {
	result := math.MaxInt

	var (
		inorder func(root *TreeNode)
		prev    *int
	)
	inorder = func(root *TreeNode) {
		if root == nil {
			return
		}

		inorder(root.Left)

		if prev != nil {
			diff := root.Val - *prev
			if diff < result {
				result = diff
			}
		}

		val := root.Val
		prev = &val

		inorder(root.Right)
	}

	inorder(root)

	return result
}
