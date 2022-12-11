// Solved by @kitanoyoru

struct TreeNode {
  int val;
  struct TreeNode *left;
  struct TreeNode *right;
};

int max3(int a, int b, int c) {
  if (a >= b) {
    return fmax(a, c);
  } else {
    return fmax(b, c);
  }
}

int dfs(struct TreeNode* node, int *ans) {
  if (node == NULL) {
    return 0;
  }

  int ls = dfs(node->left, ans);
  int rs = dfs(node->right, ans);

  int lpath = node->val + ls;
  int rpath = node->val + rs;
  int lrpath = node->val + ls + rs;

  int maxpath = max3(lpath, rpath, lrpath);

  *ans = max3(*ans, maxpath, node->val);

  return max3(lpath, rpath, node->val);
}

int maxPathSum(struct TreeNode* root){
  int ans = INT_MIN;
  dfs(root, &ans);
  return ans;
}
