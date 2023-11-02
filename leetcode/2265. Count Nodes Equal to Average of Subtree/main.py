import math

from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def averageOfSubtree(self, root: Optional[TreeNode]) -> int:
        self.counter = 0

        self.dfs(root)

        return self.counter

    def dfs(self, root: Optional[TreeNode]):
        if not root:
            return

        self.dfs(root.left)
        if root.val == self.find_node_avg(root):
            self.counter += 1
        self.dfs(root.right)

    def find_node_avg(self, root: Optional[TreeNode]) -> int:
        avg_node_vals = []
        self.inorder_traversal_to_find_avg(root, avg_node_vals)

        return math.floor(sum(avg_node_vals) / len(avg_node_vals))

    def inorder_traversal_to_find_avg(self, root: Optional[TreeNode], avg_node_vals: List[int]):
        if not root:
            return

        self.inorder_traversal_to_find_avg(root.left, avg_node_vals)
        avg_node_vals.append(root.val)
        self.inorder_traversal_to_find_avg(root.right, avg_node_vals)

