package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func diameterOfBinaryTree(root *TreeNode) int {
	var (
		result int
		dfs    func(root *TreeNode) int
	)

	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}

		leftPath := dfs(root.Left)
		rightPath := dfs(root.Right)

		result = max(result, leftPath+rightPath)

		return 1 + max(leftPath, rightPath)
	}

	dfs(root)

	return result
}
