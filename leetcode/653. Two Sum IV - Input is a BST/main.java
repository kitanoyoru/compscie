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
  private boolean dfs(TreeNode root, int k, HashMap<Integer, Boolean> m) {
    if (root == null) {
      return false;
    }
    if (m.containsKey(k - root.val)) {
      return true;
    }

    m.put(root.val, true);

    return dfs(root.left, k, m) || dfs(root.right, k, m);
  }

  public boolean findTarget(TreeNode root, int k) {
    return dfs(root, k, new HashMap<Integer, Boolean>());
  }
}
