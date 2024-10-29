package main

import (
	"slices"
	"sort"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func flipEquiv(root1 *TreeNode, root2 *TreeNode) bool {
	if root1 == nil && root2 == nil {
		return true
	}

	layers1, layers2 := sortLayers(getTreeLayers(root1)), sortLayers(getTreeLayers(root2))

	if len(layers1) != len(layers2) {
		return false
	}

	for i := 0; i < len(layers1); i++ {
		if !slices.EqualFunc(layers1[i], layers2[i], func(node1, node2 *TreeNode) bool {
			return node1.Val == node2.Val
		}) {
			return false
		}
	}

	return true
}

func getTreeLayers(root *TreeNode) [][]*TreeNode {
	if root == nil {
		return [][]*TreeNode{}
	}

	layers := [][]*TreeNode{}

	q := []*TreeNode{root}

	for len(q) > 0 {
		n := len(q)

		layer := []*TreeNode{}

		for i := 0; i < n; i++ {
			node := q[0]
			q = q[1:]

			if node.Left != nil {
				q = append(q, node.Left)
			}

			if node.Right != nil {
				q = append(q, node.Right)

			}

			layer = append(layer, node)
		}

		layers = append(layers, layer)
	}

	return layers
}

func sortLayers(layers [][]*TreeNode) [][]*TreeNode {
	for _, layer := range layers {
		for i := 0; i < len(layer)-1; i++ {
			sort.Slice(layer[i:i+1], func(k, j int) bool {
				return layer[k].Val < layer[j].Val
			})
		}
	}

	return layers
}
