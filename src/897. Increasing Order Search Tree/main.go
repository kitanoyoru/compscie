// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func helper(root, tail *TreeNode) *TreeNode {
	if root == nil {
		return tail
	}
	res := helper(root.Left, root)
	root.Left = nil
	root.Right = helper(root.Right, tail)
	return res
}

func increasingBST(root *TreeNode) *TreeNode {
	return helper(root, nil)
}
