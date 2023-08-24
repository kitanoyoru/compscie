// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func checkSlices(arr1, arr2 []int) bool {
	if len(arr1) != len(arr2) {
		return false
	}

	for i := 0; i < len(arr1); i++ {
		if arr1[i] != arr2[i] {
			return false
		}
	}

	return true
}

func inorderGetLeaves(root *TreeNode, arr *[]int) {
	if root == nil {
		return
	}

	inorderGetLeaves(root.Left, arr)
	if root.Left == nil && root.Right == nil {
		*arr = append(*arr, root.Val)
	}
	inorderGetLeaves(root.Right, arr)
}

func leafSimilar(root1 *TreeNode, root2 *TreeNode) bool {
	arr1, arr2 := []int{}, []int{}

	inorderGetLeaves(root1, &arr1)
	inorderGetLeaves(root2, &arr2)

	return checkSlices(arr1, arr2)
}
