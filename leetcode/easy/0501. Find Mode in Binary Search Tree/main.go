// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func dfs(node *TreeNode, m *map[int]int) {
	if node == nil {
		return
	}
	dfs(node.Left, m)
	if _, exists := (*m)[node.Val]; exists == false {
		(*m)[node.Val] = 0
	}
	(*m)[node.Val] += 1
	dfs(node.Right, m)
}

func findMode(root *TreeNode) (ans []int) {
	m := make(map[int]int)

	dfs(root, &m)

	max := 0
	for _, v := range m {
		if v > max {
			max = v
		}
	}
	for k, v := range m {
		if v == max {
			ans = append(ans, k)
		}
	}

	return
}
