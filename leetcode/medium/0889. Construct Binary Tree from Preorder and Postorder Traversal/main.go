package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func constructFromPrePost(preorder []int, postorder []int) *TreeNode {
	postValToIdx := make(map[int]int, len(postorder))
	for i, v := range postorder {
		postValToIdx[v] = i
	}

	var helper func(i1, i2, j1, j2 int) *TreeNode
	helper = func(i1, i2, j1, j2 int) *TreeNode {
		if i1 > i2 || j1 > j2 {
			return nil
		}

		root := &TreeNode{Val: preorder[i1]}
		if i1 != i2 {
			leftValue := preorder[i1+1]

			mid := postValToIdx[leftValue]
			leftSize := mid - j1 + 1

			root.Left = helper(i1+1, i1+leftSize, j1, mid)
			root.Right = helper(i1+leftSize+1, i2, mid+1, j2-1)
		}

		return root
	}

	return helper(0, len(preorder)-1, 0, len(postorder)-1)
}
