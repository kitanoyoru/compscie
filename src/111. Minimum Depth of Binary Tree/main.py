# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        return self.dfs(root)

    def dfs(self, node: Optional[TreeNode]) -> int:
        if node is None:
            return 0

        left, right = self.dfs(node.left), self.dfs(node.right)

        if left == 0 or right == 0:
            return 1 + left + right
        
        return 1 + min(left, right)
