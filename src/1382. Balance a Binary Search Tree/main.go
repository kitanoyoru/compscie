// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func inorderTraversal(node *TreeNode, arr *[]*TreeNode) {
  if node == nil {
    return
  }
  inorderTraversal(node.Left, arr)
  *arr = append(*arr, node)
  inorderTraversal(node.Right, arr)
}

func buildBalancedBST(nodes []*TreeNode, start, end int) *TreeNode {
  if start > end {
    return nil
  }
  mid := (start + end) / 2
  root := nodes[mid]

  root.Left = buildBalancedBST(nodes, start, mid - 1)
  root.Right = buildBalancedBST(nodes, mid + 1, end)

  return root
}

func balanceBST(root *TreeNode) *TreeNode {
  var nodes []*TreeNode
  inorderTraversal(root, &nodes)

  n := len(nodes)
  return buildBalancedBST(nodes, 0, n - 1)
}
