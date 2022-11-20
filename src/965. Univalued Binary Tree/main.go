// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func dfs(node *TreeNode, val int, ans *bool) {
  if node == nil {
    return
  }
  dfs(node.Left, val, ans)
  if node.Val != val {
    *ans = false 
  }
  dfs(node.Right, val, ans)
}

func isUnivalTree(root *TreeNode) bool {
  ans := true
  dfs(root, root.Val, &ans)    
  return ans
}
