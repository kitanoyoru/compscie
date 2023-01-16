package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func NewTreeNode(val int) *TreeNode {
	return &TreeNode{
		Val: val,
	}
}

func findRoot(descriptions *[][]int) int {
	hm := make(map[int]bool)
	for _, d := range *descriptions {
		hm[d[1]] = true
	}

	for _, d := range *descriptions {
		if _, ok := hm[d[0]]; !ok {
			return d[0]
		}
	}

	return 0
}

func createBinaryTree(descriptions [][]int) *TreeNode {
	rootVal := findRoot(&descriptions)
	root := NewTreeNode(rootVal)

	var dfs func(*TreeNode)
	dfs = func(node *TreeNode) {
		if node == nil {
			return
		}

		for _, d := range descriptions {
			if d[0] == node.Val {
				newNode := NewTreeNode(d[1])
				if d[2] == 1 {
					node.Left = newNode
				} else {
					node.Right = newNode
				}
				dfs(newNode)
			}
		}
	}

	dfs(root)

	return root
}
