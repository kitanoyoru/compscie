// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-pruning/

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

const pruneTree = (root: TreeNode | null): TreeNode | null => {
  if (root) {
    root.left = pruneTree(root.left)
    root.right = pruneTree(root.right)
    if (!root.left && !root.right && root.val == 0) {
      return null
    }
  }

  return root
}
