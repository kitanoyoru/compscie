// Solved by @kitanoyoru
// https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func max(a, b int) int {
  if a < b {
    return b
  }

  return a
}

func getDeepestLevel(node *TreeNode) int {
  if node == nil {
    return 0;
  }

  return 1 + max(getDeepestLevel(node.Left), getDeepestLevel(node.Right)) 
}

func dfs(node *TreeNode) *TreeNode {
  leftHeight, rightHeight := getDeepestLevel(node.Left), getDeepestLevel(node.Right)
  
  if leftHeight > rightHeight {
    return dfs(node.Left)
  } else if leftHeight < rightHeight {
    return dfs(node.Right)
  } else {
    return node
  }
}

func subtreeWithAllDeepest(root *TreeNode) *TreeNode {
  return dfs(root) 
}
