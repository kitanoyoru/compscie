// SOlved by @kitanoyoru

package main

import "math"

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func abs(x int) int {
  if x < 0 {
    return -x
  }
  return x
}

func min(x, y int) int {
  if x < y {
    return x
  }
  return y
}

func dfs(node *TreeNode, ans, prev *int) {
  if node == nil {
    return
  }
  dfs(node.Left, ans, prev)
  if *prev != -1 {
    *ans = min(*ans, abs(node.Val - *prev))
  }
  *prev = node.Val
  dfs(node.Right, ans, prev)
}

func getMinimumDifference(root *TreeNode) int {
  ans, prev := math.MaxInt, -1
  dfs(root, &ans, &prev)
  return ans
}
