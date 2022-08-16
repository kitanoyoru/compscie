// Solved by @kitanoyoru
// https://leetcode.com/problems/invert-binary-tree/

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class Solution {
  private void helper(TreeNode root) {
    if (root == null) {
      return;
    }

    var temp = root.left;
    root.left = root.right;
    root.right = temp;

    helper(root.left);
    helper(root.right);
  }

  public TreeNode invertTree(TreeNode root) {
    this.helper(root);

    return root;
  }
}
