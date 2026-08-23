// Solved by @kitanoyoru

struct TreeNode {
  int val;
  struct TreeNode *left;
  struct TreeNode *right;
};

int dfs(struct TreeNode* root, int* ans) {
  if (root == NULL) {
    return 0;
  }
  
  int left = dfs(root->left, ans);
  int right = dfs(root->right, ans);
  *ans += abs(left - right);

  return left + right + root->val;
}

int findTilt(struct TreeNode* root){
  int ans = 0;
  dfs(root, &ans);
  return ans;
}
