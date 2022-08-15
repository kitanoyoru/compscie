// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-level-order-traversal/

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

import java.util.LinkedList;
import java.util.ArrayList;
import java.util.Queue;

class Solution {
  public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>>  ans = new ArrayList<>();

    if (root != null) {
      Queue<TreeNode> q = new LinkedList<>();
      q.add(root);

      while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        int size = q.size();

        while (size-- > 0) {
          TreeNode node = q.remove();
          level.add(node.val);
          if (node.left != null) {
            q.add(node.left);
          }
          if (node.right != null) {
            q.add(node.right);
          }
        }

        ans.add(level);
      }
    }

    return ans;
  }
}
