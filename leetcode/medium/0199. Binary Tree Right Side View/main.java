// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-right-side-view/

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
  private void dfs(TreeNode node, List<Integer> ans, int level) {
    if (node == null) {
      return;
    }

    if (ans.size() == level) {
      ans.add(node.val);
    }

    dfs(node.right, ans, level + 1);
    dfs(node.left, ans, level + 1);
  }

  public List<Integer> rightSideView(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    if (root == null) {
      return ans;
    }
    dfs(root, ans, 0);

    return ans;
  }
}

