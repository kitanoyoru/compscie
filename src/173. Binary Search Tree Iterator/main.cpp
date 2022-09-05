// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-search-tree-iterator/

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
class BSTIterator {
private:
  stack<TreeNode*> s;
private:
  void pushToStack(TreeNode* root) {
    while (root != NULL) {
      s.push(root);
      root = root->left;
    }
  }
public:
  BSTIterator(TreeNode* root) {
    pushToStack(root);
  }
  
  int next() {
    TreeNode *node = s.top();
    s.pop();
    if (node->right) {
      pushToStack(node->right);
    }
    return node->val;
  }
  
  bool hasNext() {
     return !s.empty(); 
  }
};

/**
 * Your BSTIterator object will be instantiated and called as such:
 * BSTIterator* obj = new BSTIterator(root);
 * int param_1 = obj->next();
 * bool param_2 = obj->hasNext();
 */
