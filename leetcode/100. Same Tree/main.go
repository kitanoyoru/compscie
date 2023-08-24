// Solved by @kitanoyoru
// https://leetcode.com/problems/same-tree/

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isSameTree(p *TreeNode, q *TreeNode) bool {
	if p == nil && q == nil {
		return true
	}
	if p == nil || q == nil {
		return false
	}
	if p.val == q.val {
		return isSameTree(q.Left, p.Left) && isSameTree(q.Right, p.Right)
	}
	return false
}
