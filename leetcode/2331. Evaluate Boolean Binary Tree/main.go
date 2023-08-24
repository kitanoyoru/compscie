// Solved by @kitanoyoru
// https://leetcode.com/problems/evaluate-boolean-binary-tree/

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func evaluateTree(root *TreeNode) bool {
	if root.Left != nil && root.Right != nil {
		if root.Val == 2 {
			return evaluateTree(root.Left) || evaluateTree(root.Right)
		} else if root.Val == 3 {
			return evaluateTree(root.Left) && evaluateTree(root.Right)
		}
	}

	if root.Val == 1 {
		return true
	} else {
		return false
	}
}
