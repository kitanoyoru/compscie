// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-paths

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

const backtracking = (
  node: Optional<TreeNode>,
  path: string[],
  output: string[]
) => {
  path.push(String(node?.val!))

  if (node?.left == null && node?.right == null) {
    output.push(path.join("->"))
  }

  if (node?.left != null) {
    backtracking(node.left, path, output)
  }
  if (node?.right != null) {
    backtracking(node.right, path, output)
  }

  path.pop()

  return output
}

const binaryTreePaths = (root: TreeNode | null): string[] => {
  return backtracking(root, [], [])
}

export {}
