// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-search-tree-iterator/submissions/

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
class BSTIterator {
  
  private Stack<TreeNode> st = new Stack<>();
  
  private void pushToStack(TreeNode root) {
    while (root != null) {
      st.push(root);
      root = root.left;
    }
  }

  public BSTIterator(TreeNode root) {
     pushToStack(root);
  }
  
  public int next() {
    TreeNode node = st.pop();
    pushToStack(node.right);
    return node.val;
  }
  
  public boolean hasNext() {
    return !st.isEmpty();
  }
}

/**
 * Your BSTIterator object will be instantiated and called as such:
 * BSTIterator obj = new BSTIterator(root);
 * int param_1 = obj.next();
 * boolean param_2 = obj.hasNext();
 */
