// Solved by @kitanoyoru
// https://leetcode.com/problems/recover-binary-search-tree/

package main

import "fmt"

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

const (
  INT_MIN = -1 * int(1e10)
)

func inorderTraversal(node *TreeNode, first, second, prev **TreeNode) {
  if node == nil {
    return
  }

  inorderTraversal(node.Left, first, second, prev)
  
  if *first == nil && (*prev).Val >= node.Val {
    *first = *prev
  }
  if *first != nil && (*prev).Val >= node.Val {
    *second = node 
  }
  *prev = node

  inorderTraversal(node.Right, first, second, prev)
}

func recoverTree(root *TreeNode)  { 
  var first, second, prev *TreeNode = nil, nil, &TreeNode {
    Val: INT_MIN,
    Left: nil,
    Right: nil,
  }

  inorderTraversal(root, &first, &second, &prev)

  fmt.Println(first.Val, second.Val)

  if first != nil && second != nil {
    first.Val, second.Val = second.Val, first.Val
  }
}
