// Solved by @kitanoyoru
// https://leetcode.com/problems/count-good-nodes-in-binary-tree/

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

const goodNodes = (root: TreeNode | null): number => {
  const helper = (root: TreeNode | null, val: number): number => {
    if (root) {
      let k =
        helper(root.left, Math.max(val, root.val)) +
        helper(root.right, Math.max(val, root.val))
      if (root.val >= val) {
        k++
      }
      return k
    }
    return 0
  }

  return helper(root, root.val)
}
