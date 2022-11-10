// Solved by @kitanoyoru
// https://leetcode.com/problems/reverse-odd-levels-of-binary-tree/

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func dfs(l *TreeNode, r *TreeNode, level int) {
  if l == nil || r == nil {
    return
  }

  if level % 2 != 0 {
    temp := l.Val
    l.Val = r.Val
    r.Val = temp
  }

  dfs(l.Left, r.Right, level + 1)
  dfs(l.Right, r.Left, level + 1)
}

func reverseOddLevels(root *TreeNode) *TreeNode {
  dfs(root.Left, root.Right, 1)
  return root
}
