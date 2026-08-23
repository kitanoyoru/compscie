package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func getDeepestLevel(node *TreeNode) int {
	if node == nil {
		return 0
	}

	return 1 + max(getDeepestLevel(node.Left), getDeepestLevel(node.Right))
}

func dfs(node *TreeNode) *TreeNode {
	leftDepth, rightDepth := getDeepestLevel(node.Left), getDeepestLevel(node.Right)

	if leftDepth > rightDepth {
		return dfs(node.Left)
	} else if leftDepth < rightDepth {
		return dfs(node.Right)
	} else {
		return node
	}
}

func subtreeWithAllDeepest(root *TreeNode) *TreeNode {
	return dfs(root)
}
