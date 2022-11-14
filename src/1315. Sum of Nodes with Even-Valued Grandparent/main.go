// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func dfs(node, parent, gparent *TreeNode, ans *int) {
  if node == nil {
    return
  }
  if gparent != nil && gparent.Val % 2 == 0 {
    *ans += node.Val
  }

  dfs(node.Left, node, parent, ans)
  dfs(node.Right, node, parent, ans)
}

func sumEvenGrandparent(root *TreeNode) int {
  ans := 0
  dfs(root, nil, nil, &ans)
  return ans
}
