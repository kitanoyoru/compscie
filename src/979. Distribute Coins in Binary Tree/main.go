// Solved by @kitanoyoru

package main


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

func distributeCoins(root *TreeNode) int {
  ans := 0

  if root.Left != nil {
    ans += distributeCoins(root.Left)
    root.Val += root.Left.Val - 1
    ans += abs(root.Left.Val - 1)
  }
  if root.Right != nil {
    ans += distributeCoins(root.Right)
    root.Val += root.Right.Val - 1
    ans += abs(root.Right.Val - 1)
  }

  return ans
}
