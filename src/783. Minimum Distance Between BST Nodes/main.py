# Solved by @kitanoyoru

import sys

from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def __init__(self) -> None:
        self.ans: int = sys.maxsize 
        self.prev: Optional[int] = None
        
    def minDiffInBST(self, root: Optional[TreeNode]) -> int:
        self.dfs(root)
        return self.ans

    def dfs(self, root: Optional[TreeNode]) -> None:
        if root is None:
            return
        self.dfs(root.left)
        if self.prev is not None:
            self.ans = min(self.ans, root.val - self.prev)
        self.prev = root.val
        self.dfs(root.right)
