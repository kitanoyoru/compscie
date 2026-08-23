package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func longestZigZag(root *TreeNode) int {
	ans := 0
	longestZigZagHelper(root, &ans)
	return ans
}

func longestZigZagHelper(root *TreeNode, ans *int) [2]int {
	if root == nil {
		return [2]int{-1, -1}
	}

	left := 1 + longestZigZagHelper(root.Left, ans)[1]
	right := 1 + longestZigZagHelper(root.Right, ans)[0]

	if right > *ans && right > left {
		*ans = right
	} else if left > *ans && left > right {
		*ans = left
	}

	return [2]int{left, right}
}
