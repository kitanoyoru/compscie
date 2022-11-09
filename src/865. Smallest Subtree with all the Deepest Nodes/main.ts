// Solved by @kitanoyoru
// https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes

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

const getHighestLevel = (node: TreeNode | null): number => {
  if (node == null) {
    return 0
  }

  return 1 + Math.max(getHighestLevel(node.left), getHighestLevel(node.right))
}

const dfs = (node: TreeNode | null): TreeNode | null => {
  let leftHeight = getHighestLevel(node!.left),
    rightHeight = getHighestLevel(node!.right)

  if (leftHeight > rightHeight) {
    return dfs(node!.left)
  } else if (leftHeight < rightHeight) {
    return dfs(node!.right)
  } else {
    return node
  }
}

const subtreeWithAllDeepest = (root: TreeNode | null): TreeNode | null => {
  return dfs(root)
}

export {}
