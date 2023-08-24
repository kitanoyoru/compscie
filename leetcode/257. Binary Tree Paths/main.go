// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-paths/

package main

import (
	"strconv"
	"strings"
)

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func backtracking(node *TreeNode, path []string, output *[]string) {
	path = append(path, strconv.Itoa(node.Val))

	if node.Left == nil && node.Right == nil {
		*output = append(*output, strings.Join(path, "->"))
	}

	if node.Left != nil {
		backtracking(node.Left, path, output)
	}
	if node.Right != nil {
		backtracking(node.Right, path, output)
	}

	path = path[:len(path)-1]
}

func binaryTreePaths(root *TreeNode) []string {
	var output []string

	backtracking(root, []string{}, &output)

	return output
}
