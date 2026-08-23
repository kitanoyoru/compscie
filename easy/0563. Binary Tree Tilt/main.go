// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func dfs(node *TreeNode, ans *int) int {
	if node == nil {
		return 0
	}

	l := dfs(node.Left, ans)
	r := dfs(node.Right, ans)
	*ans += abs(l - r)

	return l + r + node.Val
}

func findTilt(root *TreeNode) int {
	ans := 0
	dfs(root, &ans)
	return ans
}
