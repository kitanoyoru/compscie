// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func maxInt(a, b int) int {
	if a > b {
		return a
	} else {
		return b
	}
}

func treeHeight(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return 1 + maxInt(treeHeight(root.Left), treeHeight(root.Right))
}

func findDeepestLeaves(node *TreeNode, level, height int, deepestLeaves *[]*TreeNode) {
	if node == nil {
		return
	}
	if level == height {
		*deepestLeaves = append(*deepestLeaves, node)
	}

	findDeepestLeaves(node.Left, level+1, height, deepestLeaves)
	findDeepestLeaves(node.Right, level+1, height, deepestLeaves)
}

func deepestLeavesSum(root *TreeNode) (ans int) {
	var deepestLeaves []*TreeNode
	height := treeHeight(root)

	findDeepestLeaves(root, 1, height, &deepestLeaves)
	for _, leaf := range deepestLeaves {
		ans += leaf.Val
	}

	return
}
