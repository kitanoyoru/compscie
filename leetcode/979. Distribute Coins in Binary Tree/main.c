// Solved by @kitanoyoru

struct TreeNode {
  int val;
  struct TreeNode *left;
  struct TreeNode *right;
};

int distributeCoins(struct TreeNode* root){
  int ans = 0;

  if (root->left != NULL) {
    ans += distributeCoins(root->left);
    root->val += root->left->val - 1;
    ans += abs(root->left->val - 1);
  }
  if (root->right != NULL) {
    ans += distributeCoins(root->right);
    root->val += root->right->val - 1;
    ans += abs(root->right->val - 1);
  }

  return ans;
}
