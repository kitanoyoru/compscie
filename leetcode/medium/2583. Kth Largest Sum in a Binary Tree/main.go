package main

import "sort"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func kthLargestLevelSum(root *TreeNode, k int) int64 {
	sums := levelSums(root)
	if sums == nil {
		return -1
	}

	if len(sums) < k {
		return -1
	}

	sort.Sort(sort.Reverse(sort.IntSlice(sums)))

	return int64(sums[k-1])
}

func levelSums(root *TreeNode) []int {
	if root == nil {
		return nil
	}

	q := []*TreeNode{root}
	sums := []int{}

	for len(q) > 0 {
		levelSum, levelSize := 0, len(q)

		for i := 0; i < levelSize; i++ {
			node := q[0]
			q = q[1:]

			levelSum += node.Val

			if node.Left != nil {
				q = append(q, node.Left)
			}
			if node.Right != nil {
				q = append(q, node.Right)
			}
		}

		sums = append(sums, levelSum)
	}

	return sums
}
