// Solved by @kitanoyoru
// https://leetcode.com/problems/maximum-depth-of-binary-tree/

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

const helper = (root: TreeNode | null, level: number): number => {
  if (!root) {
    return level;
  }
  return Math.max(helper(root.left, level + 1), helper(root.right, level + 1));
};

const maxDepth = (root: TreeNode | null): number => {
  let level: number = 0;

  return helper(root, level);
};

