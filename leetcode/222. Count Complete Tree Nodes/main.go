// Solved by @kitanoyoru
// https://leetcode.com/problems/count-complete-tree-nodes/

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func inorderTraversal(node *TreeNode, counter *int) {
	if node == nil {
		return
	}
	inorderTraversal(node.Left, counter)
	*counter++
	inorderTraversal(node.Right, counter)

}

func countNodes(root *TreeNode) int {
	var counter int = 0

	inorderTraversal(root, &counter)

	return counter
}
