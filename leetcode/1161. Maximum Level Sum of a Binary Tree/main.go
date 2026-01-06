package main

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func maxLevelSum(root *TreeNode) int {
	layerSums := make(map[int]int)

	var dfs func(node *TreeNode, layer int)
	dfs = func(node *TreeNode, layer int) {
		if node == nil {
			return
		}

		layerSums[layer] += node.Val

		for _, node := range []*TreeNode{node.Left, node.Right} {
			dfs(node, layer+1)
		}
	}

	dfs(root, 1)

	var (
		smallestLayer = math.MaxInt
		maxSum        = math.MinInt
	)

	for i, val := range layerSums {
		if val == maxSum {
			smallestLayer = min(smallestLayer, i)
		} else if val > maxSum {
			maxSum = max(maxSum, val)
			smallestLayer = i
		}
	}

	return smallestLayer 
}
