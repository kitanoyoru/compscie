// Solved by @kitanoyoru

package main

type TreeNode struct {
  Val int
  Left *TreeNode
  Right *TreeNode
}

func dfs(node, parent *TreeNode, x, y int, px, py **TreeNode, lx, ly *int, level int) {
  if node == nil {
    return
  }
  if node.Val == x {
    *px = parent 
    *lx = level
  }
  if node.Val == y {
    *py = parent 
    *ly = level
  }

  dfs(node.Left, node, x, y, px, py, lx, ly, level + 1)
  dfs(node.Right, node, x, y, px, py, lx, ly, level + 1)
}

func isCousins(root *TreeNode, x int, y int) bool {
  var px *TreeNode
  var py *TreeNode

  level, lx, ly := 0, 0, 0
  
  dfs(root, nil, x, y, &px, &py, &lx, &ly, level)
  return lx == ly && px != py 
}
