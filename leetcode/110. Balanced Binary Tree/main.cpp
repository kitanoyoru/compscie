// Solved by @kitanoyoru
// https://leetcode.com/problems/balanced-binary-tree/

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
private:
  int find_sub_height(TreeNode* node) {
    if (node == nullptr) {
      return 0;
    }

    return max(find_sub_height(node->left), find_sub_height(node->right)) + 1;
  }

public:
  bool isBalanced(TreeNode* root) {
    if (root == nullptr) {
      return true;
    }

    int left_h = find_sub_height(root->left);
    int right_h = find_sub_height(root->right);

    if (abs(left_h - right_h) <= 1 && isBalanced(root->left) && isBalanced(root->right)) {
      return true;      
    }

    return false;
  }
};
