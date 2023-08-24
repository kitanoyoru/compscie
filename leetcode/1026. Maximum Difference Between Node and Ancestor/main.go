// Solved by @kitanoyoru

package main

import (
	"math"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func dfs(root *TreeNode, low, high int, ans *int) {
	if root == nil {
		return
	}
	*ans = max(*ans, max(abs(root.Val-low), abs(root.Val-high)))

	if root.Val < low {
		low = root.Val
	}
	if root.Val > high {
		high = root.Val
	}

	dfs(root.Left, low, high, ans)
	dfs(root.Right, low, high, ans)

}

func maxAncestorDiff(root *TreeNode) int {
	ans := math.MinInt32
	dfs(root, root.Val, root.Val, &ans)
	return ans
}
