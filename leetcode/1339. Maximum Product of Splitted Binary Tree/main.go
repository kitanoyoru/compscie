package main

import "math"

const (
	Mod = 1_000_000_000 + 7
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func treeSum(node *TreeNode) int {
	if node == nil {
		return 0
	}

	return node.Val + treeSum(node.Left) + treeSum(node.Right)
}

func maxProduct(root *TreeNode) int {
	var (
		result       = math.MinInt
		totalTreeSum = treeSum(root)
	)

	var traverse func(node *TreeNode) int
	traverse = func(node *TreeNode) int {
		if node == nil {
			return 0
		}

		leftSum, rightSum := traverse(node.Left), traverse(node.Right)

		result = max(result, leftSum*(totalTreeSum-leftSum))
		result = max(result, rightSum*(totalTreeSum-rightSum))

		return node.Val + leftSum + rightSum
	}

	traverse(root)

	return result % Mod 
}

