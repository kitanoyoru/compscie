// Solved by @kitanoyoru
// https://leetcode.com/problems/kth-smallest-element-in-a-bst/

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */

class Solution {
public:
  int ans = 0;

  void helper(TreeNode* node, int& k) {
    if (node == NULL) {
      return;
    }
    helper(node->left, k);
    if (--k == 0) {
      ans = node->val;
      return;
    }
    helper(node->right, k);
  }

  int kthSmallest(TreeNode* root, int k) {
    helper(root, k);

    return ans;
  }
};

