package main

import "sort"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func findSecondMinimumValue(root *TreeNode) int {
	var (
		set     = make(map[int]struct{})
		inorder func(root *TreeNode)
	)

	inorder = func(root *TreeNode) {
		if root == nil {
			return
		}

		inorder(root.Left)
		set[root.Val] = struct{}{}
		inorder(root.Right)
	}

	inorder(root)

	s := make([]int, 0, len(set))
	for v := range set {
		s = append(s, v)
	}

	if len(s) == 1 {
		return -1
	}

	sort.Ints(s)

	return s[1]
}
