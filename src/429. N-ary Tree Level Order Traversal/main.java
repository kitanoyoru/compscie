// Solved by @kitanoyoru
// https://leetcode.com/problems/n-ary-tree-level-order-traversal/

/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
  public List<List<Integer>> levelOrder(Node root) {
    if (root == null) {
      return new ArrayList<>();
    }
    List<List<Integer>> ans = new ArrayList<>();
    
    Queue<Node> q = new LinkedList<>();
    q.add(root);

    while (!q.isEmpty()) {
      int len = q.size();
      List<Integer> level = new ArrayList<>();
      
      while (len-- != 0) {
        Node node = q.remove();

        level.add(node.val);
        for (Node child : node.children) {
          q.add(child);
        }
      }

      ans.add(level);
    }

    return ans;
  }
}

