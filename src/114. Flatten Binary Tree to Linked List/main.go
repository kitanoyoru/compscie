// Solved by @kitanoyoru
// https://leetcode.com/problems/flatten-binary-tree-to-linked-list/

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

var prev *TreeNode = nil

func flatten(root *TreeNode)  {
  if root == nil {
    return
  }

  flatten(root.Right)
  flatten(root.Left)

  root.Right = prev
  root.Left = nil
  prev = root
}
