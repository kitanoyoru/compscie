package main


type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func diameterOfBinaryTree(root *TreeNode) int {
	var (
		helper func(node *TreeNode) int
		result int
	)
	helper = func(node *TreeNode) int {
		if node == nil {
			return 0
		}

		left, right := helper(node.Left), helper(node.Right)

		result = max(result, left + right)

		return 1 + max(left, right)
	}

	helper(root)

	return result
}
