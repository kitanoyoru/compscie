// Solved by @kitanoyoru
// https://leetcode.com/problems/symmetric-tree/

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

const helper = (left: TreeNode | null, right: TreeNode | null): boolean => {
  if (!left && !right) {
    return true
  } else if (!left || !right) {
    return false
  }
  if (left.val != right.val) {
    return false
  }

  return helper(left.left, right.right) && helper(left.right, right.left)
}

const isSymmetric = (root: TreeNode | null): boolean => {
  return helper(root.left, root.right)!
}
