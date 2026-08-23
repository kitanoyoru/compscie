// Solved by @kitanoyoru

package main

type Node struct {
	Val      int
	Children []*Node
}

func helper(root *Node, arr *[]int) {
	if root == nil {
		return
	}
	for _, node := range root.Children {
		*arr = append(*arr, node.Val)
		helper(node, arr)
	}
}

func preorder(root *Node) []int {
	var arr []int
	if root == nil {
		return arr
	}
	arr = append(arr, root.Val)
	helper(root, &arr)
	return arr
}
