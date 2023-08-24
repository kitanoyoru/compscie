// Solved by @kitanoyoru
// https://leetcode.com/problems/balanced-binary-tree/

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

const subtreeHeight = (root: TreeNode | null): number => {
  if (root === null) {
    return 0
  }
  return Math.max(subtreeHeight(root.left), subtreeHeight(root.right)) + 1
}

const isBalanced = (root: TreeNode | null): boolean => {
  if (root === null) {
    return true
  }

  let leftH = subtreeHeight(root.left)
  let rightH = subtreeHeight(root.right)

  if (
    Math.abs(leftH - rightH) <= 1 &&
    isBalanced(root.left) &&
    isBalanced(root.right)
  ) {
    return true
  }

  return false
}
