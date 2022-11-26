// Solved by @kitanoyoru

package main

import "math"

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func min(x, y int) int {
  if x > y {
    return y
  }
  return x
}

func dfs(node *TreeNode, ans, prev *int) {
  if node == nil {
    return
  }
  dfs(node.Left, ans, prev)
  if *prev != -1 {
    *ans = min(*ans, node.Val - *prev)
  }
  *prev = node.Val
  dfs(node.Right, ans, prev)
}

func minDiffInBST(root *TreeNode) int {
  ans, prev := math.MaxInt, -1 
  dfs(root, &ans, &prev)
  return ans
}
