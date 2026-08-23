package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isBalanced(root *TreeNode) bool {
	if root == nil {
		return true
	}

	var findTreeHeight func(node *TreeNode) int
	findTreeHeight = func(node *TreeNode) int {
		if node == nil {
			return 0
		}

		return 1 + max(findTreeHeight(node.Left), findTreeHeight(node.Right))
	}

	return abs(findTreeHeight(root.Left)-findTreeHeight(root.Right)) <= 1 && isBalanced(root.Left) && isBalanced(root.Right)
}

func abs(v int) int {
	if v < 0 {
		return -v
	}

	return v
}
