// Solved by @kitanoyoru
// https://leetcode.com/problems/merge-two-binary-trees/

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

const mergeTrees = (root1: TreeNode | null, root2: TreeNode | null): TreeNode | null => {
  if (!root1) {
    return root2;
  } else if (!root2) {
    return root1;
  } else {
    root1.val += root2.val;

    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);

    return root1;
  }
};
