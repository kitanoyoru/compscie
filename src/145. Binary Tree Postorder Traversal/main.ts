// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-postorder-traversal/

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

const helper = (root: TreeNode | null, ans: number[]) => {
  if (!root) {
    return;
  }
  helper(root.left, ans);
  helper(root.right, ans);
  ans.push(root.val);
}

const postorderTraversal = (root: TreeNode | null): number[] => {
  let ans: number[] = [];

  helper(root, ans);

  return ans;
};
