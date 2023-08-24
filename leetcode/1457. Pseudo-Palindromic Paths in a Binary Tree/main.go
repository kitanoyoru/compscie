package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func copyMap(m map[int]bool) map[int]bool {
	c := make(map[int]bool)
	for k, v := range m {
		c[k] = v
	}
	return c
}

func dfs(node *TreeNode, path map[int]bool) int {
	if node == nil {
		return 0
	}

	if _, exists := path[node.Val]; exists {
		delete(path, node.Val)
	} else {
		path[node.Val] = true
	}

	if node.Left == nil && node.Right == nil {
		if len(path) <= 1 {
			return 1
		}
		return 0
	}

	left := dfs(node.Left, copyMap(path))
	right := dfs(node.Right, copyMap(path))

	return left + right
}

func pseudoPalindromicPaths(root *TreeNode) int {
	return dfs(root, make(map[int]bool))
}
