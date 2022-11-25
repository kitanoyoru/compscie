// Solved by @kitanoyoru

package main

import "strconv"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func pathToLeaf(root *TreeNode, path string, ans *int) {
	if root == nil {
		return
	}

	path += strconv.Itoa(root.Val)

	if root.Left == nil && root.Right == nil {
		if val, err := strconv.Atoi(path); err == nil {
			*ans += val
		}
		return
	}

	pathToLeaf(root.Left, path, ans)
	pathToLeaf(root.Right, path, ans)
}

func sumNumbers(root *TreeNode) int {
	ans := 0
	pathToLeaf(root, "", &ans)

	return ans
}
