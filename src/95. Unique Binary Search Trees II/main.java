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
    public List<TreeNode> generateTrees(int n) {
        return this.helper(1, n);
    }

    private List<TreeNode> helper(int s, int n) {
        List<TreeNode> ans = new LinkedList<>();

        if (s > n) {
            ans.add(null);
            return ans;
        }

        for (int i = s; i <= n; i++) {
            for (TreeNode left : this.helper(s, i - 1)) {
                for (TreeNode right : this.helper(i + 1, n)) {
                    ans.add(new TreeNode(i, left, right));
                }
            }
        }

        return ans;
    }
}