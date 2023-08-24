// Solved by @kitanoyoru
// https://leetcode.com/problems/symmetric-tree/

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
  private boolean helper(TreeNode left, TreeNode right) {
    if (left == null && right == null) {
      return true;
    } else if (left == null || right == null) {
      return false;
    }
    if (left.val != right.val) {
      return false;
    }

    return helper(left.left, right.right) && helper(left.right, right.left);
  } 

  public boolean isSymmetric(TreeNode root) {
    return helper(root.left, root.right);      
  }
}
