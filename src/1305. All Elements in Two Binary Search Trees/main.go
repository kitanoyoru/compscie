// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func mergeArraysInAscOrder(arr1, arr2 []int) []int {
  var res []int

  i, j := 0, 0

  for i < len(arr1) && j < len(arr2) {
    if arr1[i] >= arr2[j] {
      res = append(res, arr2[j])
      j++
    } else if arr1[i] < arr2[j] {
      res = append(res, arr1[i])
      i++
    }
  }

  for i < len(arr1) {
    res = append(res, arr1[i])
    i++
  }

  for j < len(arr2) {
    res = append(res, arr2[j])
    j++
  }

  return res
}

func inorderTraversal(node *TreeNode, arr *[]int) {
  if node == nil {
    return
  }
  inorderTraversal(node.Left, arr)
  *arr = append(*arr, node.Val)
  inorderTraversal(node.Right, arr)
}

func getAllElements(root1 *TreeNode, root2 *TreeNode) []int {
  var arr1, arr2 []int
  
  inorderTraversal(root1, &arr1)
  inorderTraversal(root2, &arr2)
  
  return mergeArraysInAscOrder(arr1, arr2)
}
