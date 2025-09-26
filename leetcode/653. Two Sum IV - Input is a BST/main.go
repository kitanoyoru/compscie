package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func findTarget(root *TreeNode, k int) bool {
	m := make(map[int]struct{})

	var inorder func(node *TreeNode)
	inorder = func(node *TreeNode) {
		if node == nil {
			return
		}

		inorder(node.Left)
		m[node.Val] = struct{}{}
		inorder(node.Right)
	}

    inorder(root)

	for v := range m {
		if _, exists := m[k-v]; exists && k-v != v {
			return true
		}
	}

	return false
}

