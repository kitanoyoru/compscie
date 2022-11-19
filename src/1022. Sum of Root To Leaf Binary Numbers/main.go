// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func dfs(node *TreeNode, val int) int {
	if node == nil {
		return 0
	}
	val = val*2 + node.Val
	if node.Left == node.Right {
		return val
	} else {
		return dfs(node.Left, val) + dfs(node.Right, val)
	}
}

func sumRootToLeaf(root *TreeNode) int {
	return dfs(root, 0)
}
