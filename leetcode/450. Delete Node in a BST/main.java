// Solved by @kitanoyoru
// https://leetcode.com/problems/delete-node-in-a-bst/

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
  private TreeNode minNode(TreeNode root) {
    TreeNode cur = root;
    while (cur.left != null) {
      cur = cur.left;
    }

    return cur;
  }

  public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) {
      return null;
    } else if (root.val < key) {
      root.right = deleteNode(root.right, key);
    } else if (root.val > key) {
      root.left = deleteNode(root.left, key);
    } else {
      if (root.left == null) {
        return root.right;
      } else if (root.right == null) {
        return root.left;
      }

      TreeNode node = minNode(root.right);
      root.val = node.val;
      root.right = deleteNode(root.right, node.val);
    }

    return root;
  }
}
