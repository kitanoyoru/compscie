package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func helper(s, n int) []*TreeNode {
	ans := []*TreeNode{}

	if s > n {
		return []*TreeNode{nil}
	}

	for i := s; i <= n; i++ {
		for _, left := range helper(s, i-1) {
			for _, right := range helper(i+1, n) {
				ans = append(ans, &TreeNode{
					Val:   i,
					Left:  left,
					Right: right,
				})
			}
		}
	}

	return ans
}

func generateTrees(n int) []*TreeNode {
	return helper(1, n)
}
