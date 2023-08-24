import java.util.*;

public class TreeNode {
    int val;

    TreeNode left;
    TreeNode right;

    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> ans = new LinkedList<>();
        if (root == null) {
            return ans;
        }

        Queue<TreeNode> q = new LinkedList<>();

        q.add(root);

        while (true) {
            int size = q.size();
            if (size == 0) {
                break;
            }

            List<Integer> tempArr = new LinkedList<>();

            while (size != 0) {
                TreeNode el = q.poll();
                tempArr.add(el.val);
                if (el.left != null) {
                    q.add(el.left);
                }
                if (el.right != null) {
                    q.add(el.right);
                }
                
                size--;
            }

            ans.add(tempArr);
        }

        Collections.reverse(ans);

        return ans;
    }
}