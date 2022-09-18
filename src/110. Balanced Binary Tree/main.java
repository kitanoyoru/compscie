// Solved by @kitanoyoru
// https://leetcode.com/problems/balanced-binary-tree/

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
  private int findSubtreeHeight(TreeNode node) {
    if (node == null) {
      return 0;
    }
    return Math.max(findSubtreeHeight(node.left), findSubtreeHeight(node.right)) + 1;
  }

  public boolean isBalanced(TreeNode root) {
    if (root == null) {
      return true;
    }

    int leftHeight = findSubtreeHeight(root.left);
    int rightHeight = findSubtreeHeight(root.right);

    if (Math.abs(leftHeight - rightHeight) <= 1 && isBalanced(root.left) && isBalanced(root.right)) {
      return true;      
    }

    return false;
  }
}
