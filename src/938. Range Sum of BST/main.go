// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func dfs(node *TreeNode, low, high int, ans *int) {
  if node == nil {
    return
  }
  if node.Val >= low && node.Val <= high {
    *ans += node.Val
  }
  
  if node.Val > low {
    dfs(node.Left, low, high, ans)
  }
  if node.Val < high {
    dfs(node.Right, low, high, ans)
  }
}

func rangeSumBST(root *TreeNode, low int, high int) int {
  var ans int
  dfs(root, low, high, &ans);
  return ans
}
