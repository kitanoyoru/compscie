// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func inorderTraversal(node *TreeNode, arr *[]int) {
  if node == nil {
    return
  }
  inorderTraversal(node.Left, arr)
  *arr = append(*arr, node.Val)
  inorderTraversal(node.Right, arr)
}

func isEqualAverage(node *TreeNode) bool {
  var subtreeNodes []int
  sum := 0

  inorderTraversal(node, &subtreeNodes)
  for _, num := range subtreeNodes {
    sum += num
  }

  return node.Val == (sum / len(subtreeNodes))
}

func dfs(node *TreeNode, ans *int) {
  if node == nil {
    return
  }
  if isEqualAverage(node) {
    *ans += 1
  }

  dfs(node.Left, ans)
  dfs(node.Right, ans)
}

func averageOfSubtree(root *TreeNode) int {
  ans := 0
  dfs(root, &ans)
  return ans
}
