// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func dfs(root *TreeNode, isRoot bool, ans *[]*TreeNode, m map[int]bool) *TreeNode {
	if root == nil {
		return nil
	}
	_, exists := m[root.Val]
	if isRoot && !exists {
		*ans = append(*ans, root)
	}

	root.Left = dfs(root.Left, exists, ans, m)
	root.Right = dfs(root.Right, exists, ans, m)

	if exists {
		return nil
	}

	return root
}

func delNodes(root *TreeNode, to_delete []int) []*TreeNode {
	m, ans := make(map[int]bool), []*TreeNode{}
	for _, v := range to_delete {
		m[v] = true
	}
	dfs(root, true, &ans, m)
	return ans
}
