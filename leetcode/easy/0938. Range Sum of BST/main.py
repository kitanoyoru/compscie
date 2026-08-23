# Solved by @kitanoyoru

from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def dfs(self, node: Optional[TreeNode]) -> None:
        if node is None:
            return

        if node.val >= self.low and node.val <= self.high:
            self.ans += node.val

        if node.val > self.low:
            self.dfs(node.left)
        if node.val < self.high:
            self.dfs(node.right)

    def rangeSumBST(self, root: Optional[TreeNode], low: int, high: int) -> int:
        self.ans: int = 0
        self.low = low
        self.high = high

        self.dfs(root)

        return self.ans
