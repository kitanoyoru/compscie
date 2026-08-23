package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func preorderTraversal(root *TreeNode) []int {
	var result []int

	var preorder func(node *TreeNode)
	preorder = func(node *TreeNode) {
		if node == nil {
			return
		}

		result = append(result, node.Val)
		preorder(node.Left)
		preorder(node.Right)
	}

	preorder(root)

	return result 
}

