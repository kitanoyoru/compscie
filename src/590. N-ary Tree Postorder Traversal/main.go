// Solved by @kitanoyoru

package main

type Node struct {
  Val int
  Children []*Node
}

func helper(root *Node, arr *[]int) {
  if root == nil {
    return
  }
  for _, node := range root.Children {
    helper(node, arr)
    *arr = append(*arr, node.Val)
  }
}
func postorder(root *Node) []int {
  var arr []int
  if root == nil {
    return arr 
  }
  helper(root, &arr)
  arr = append(arr, root.Val)
  return arr
}
