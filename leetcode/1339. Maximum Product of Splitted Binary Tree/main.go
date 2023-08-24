// Solved by @kitanoyoru

package main

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func sum(root *TreeNode) int {
	if root == nil {
		return 0
	}

	return root.Val + sum(root.Left) + sum(root.Right)
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func maxProduct(root *TreeNode) int {
	totalTreeSum, ans := sum(root), math.MinInt64

	var traverse func(*TreeNode) int
	traverse = func(root *TreeNode) int {
		if root == nil {
			return 0
		}

		leftSum := traverse(root.Left)
		rightSum := traverse(root.Right)

		ans = max(ans, leftSum*(totalTreeSum-leftSum))
		ans = max(ans, rightSum*(totalTreeSum-rightSum))

		return root.Val + leftSum + rightSum
	}

	traverse(root)

	return ans % 1000000007
}
