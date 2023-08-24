// Solved by @kitanoyoru

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

const getMinimumDifference = (root: TreeNode | null): number => {
  let ans = Number.MAX_SAFE_INTEGER,
    prev = -1

  const dfs = (node: TreeNode | null) => {
    if (node == null) {
      return
    }
    dfs(node.left)
    if (prev != -1) {
      ans = Math.min(ans, Math.abs(node.val - prev))
    }
    prev = node.val
    dfs(node.right)
  }

  dfs(root)

  return ans
}

export {}
