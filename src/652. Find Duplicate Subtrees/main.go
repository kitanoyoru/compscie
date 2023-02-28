package main

import "fmt"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func findDuplicateSubtrees(root *TreeNode) []*TreeNode {
	hm := make(map[string]int)
	duplicates := []*TreeNode{}

	var traverse func(node *TreeNode) string
	traverse = func(node *TreeNode) string {
		if node == nil {
			return "#"
		}

		left := traverse(node.Left)
		right := traverse(node.Right)

		subtree := fmt.Sprintf("%v%v%v", node.Val, left, right)

		if val := hm[subtree]; val == 1 {
			duplicates = append(duplicates, node)
		}

		hm[subtree]++

		return subtree
	}

	traverse(root)

	return duplicates
}
