package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func levelOrder(root *TreeNode) [][]int {
	levels := [][]int{}
	if root == nil {
		return levels
	}

	queue := []*TreeNode{root}

	for len(queue) > 0 {
		level := []int{}
		levelSize := len(queue)

		for i := 0; i < levelSize; i++ {
			node := queue[i]
			level = append(level, node.Val)

			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}

		queue = queue[levelSize:]
		levels = append(levels, level)
	}

	return levels
}
