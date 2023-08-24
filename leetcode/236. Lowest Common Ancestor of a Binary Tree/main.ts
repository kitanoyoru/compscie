// Solved by @kitanoyoru
// https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

type Optional<T> = T | null

const findPath = (
  root: Optional<TreeNode>,
  path: TreeNode[],
  target: Optional<TreeNode>
) => {
  if (!root || !target) {
    return false
  }

  path.push(root)

  if (root.val == target.val) {
    return true
  }
  if (root.left && findPath(root.left, path, target)) {
    return true
  }
  if (root.right && findPath(root.right, path, target)) {
    return true
  }

  path.pop()

  return false
}

const lowestCommonAncestor = (
  root: Optional<TreeNode>,
  p: Optional<TreeNode>,
  q: Optional<TreeNode>
): Optional<TreeNode> => {
  let ans: Optional<TreeNode> = null
  const pathToP: TreeNode[] = [],
    pathToQ: TreeNode[] = []

  findPath(root, pathToP, p)
  findPath(root, pathToQ, q)

  const len = Math.min(pathToP.length, pathToQ.length)

  for (let i = 0; i < len; i++) {
    if (pathToP[i].val == pathToQ[i].val) {
      ans = pathToP[i]
    } else {
      break
    }
  }

  return ans
}
