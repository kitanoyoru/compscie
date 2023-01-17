package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func findBottomLeftValue(root *TreeNode) int {
	bottom, maxLevel := root, 0

	var dfs func(*TreeNode, int)
	dfs = func(node *TreeNode, level int) {
		if node == nil {
			return
		}

		dfs(node.Left, level+1)
		if level > maxLevel {
			maxLevel = level
			bottom = node
		}
		dfs(node.Right, level+1)
	}

	dfs(root, 1)

	return bottom.Val
}
