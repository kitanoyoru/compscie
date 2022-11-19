// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func dfs(node *TreeNode, nodeSum *int) {
	if node.Right != nil {
		dfs(node.Right, nodeSum)
	}
	*nodeSum += node.Val
	node.Val = *nodeSum
	if node.Left != nil {
		dfs(node.Left, nodeSum)
	}
}

func bstToGst(root *TreeNode) *TreeNode {
	nodeSum := 0
	dfs(root, &nodeSum)
	return root
}
