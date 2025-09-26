package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func countNodes(root *TreeNode) int {
	result := 0

	var inorder func(root *TreeNode)
	inorder = func(root *TreeNode) {
		if root == nil {
			return
		}

		inorder(root.Left)
		result += 1
		inorder(root.Right)
	}

	inorder(root)

	return result
}
