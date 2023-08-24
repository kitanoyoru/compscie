package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func reverse(s *[]int) {
	for i, j := 0, len(*s)-1; i < j; i, j = i+1, j-1 {
		(*s)[i], (*s)[j] = (*s)[j], (*s)[i]
	}
}

func zigzagLevelOrder(root *TreeNode) [][]int {
	if root == nil {
		return [][]int{}
	}

	ans := [][]int{}
	q := []*TreeNode{}
	dir := true

	q = append(q, root)

	for len(q) > 0 {
		level := []int{}
		size := len(q)

		for i := 0; i < size; i++ {
			node := q[0]
			q = q[1:]

			level = append(level, node.Val)

			if node.Left != nil {
				q = append(q, node.Left)
			}
			if node.Right != nil {
				q = append(q, node.Right)
			}
		}

		if dir {
			ans = append(ans, level)
		} else {
			reverse(&level)
			ans = append(ans, level)
		}

		dir = !dir
	}

	return ans
}
