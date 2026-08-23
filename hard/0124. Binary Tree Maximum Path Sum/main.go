// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func max(arr ...int) int {
	max := arr[0]

	for _, v := range arr {
		if max < v {
			max = v
		}
	}

	return max
}

func maxPathSum(root *TreeNode) int {
	var ans int = -1 << 31

	var dfs func(*TreeNode) int
	dfs = func(node *TreeNode) int {
		if node == nil {
			return 0
		}

		left, right := dfs(node.Left), dfs(node.Right)
		spath := max(node.Val+max(left, right), node.Val)
		ans = max(ans, spath, node.Val+left+right)

		return spath
	}

	dfs(root)

	return ans
}
