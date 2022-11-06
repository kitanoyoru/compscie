// Solved by @kitanoyoru
// https://leetcode.com/problems/count-complete-tree-nodes/

class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

type Optional<T> = T | null

const countNodes = (root: Optional<TreeNode>): number => {
  if (root == null) {
    return 0
  }

  return 1 + countNodes(root.left) + countNodes(root.right)
}

export {}
