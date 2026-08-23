// Solved by @kitanoyoru
// https://leetcode.com/problems/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree/

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

const getTargetCopy = (
  original: TreeNode | null,
  cloned: TreeNode | null,
  target: TreeNode | null
): TreeNode | null => {
  let ans: TreeNode

  const dfs = (cloned: TreeNode | null) => {
    if (cloned == null) {
      return
    }
    if (cloned.val == target!.val) {
      ans = cloned
      return
    }

    dfs(cloned.left)
    dfs(cloned.right)
  }

  dfs(cloned)

  return ans
}
