// Solved by @kitanoyoru
// https://leetcode.com/problems/validate-binary-search-tree/

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

const helper = (root: TreeNode | null, max: number, min: number): boolean  => {
  if (!root) {
    return true;
  }
  if (root.val >= max || root.val <= min) {
    return false;
  }
  return helper(root.left, root.val, min) && helper(root.right, max, root.val);
};

const isValidBST = (root: TreeNode | null) => {
  return helper(root, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
};

export {}
