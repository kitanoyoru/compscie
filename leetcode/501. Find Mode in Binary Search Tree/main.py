from functools import reduce
from typing import List, Optional

from collections import defaultdict


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def __init__(self):
        self._m = defaultdict(int)

    def findMode(self, root: Optional[TreeNode]) -> List[int]:
        self.dfs(root)

        max_val = max(self._m.values())
        result = reduce(
            lambda acc, item: acc + [item[0]] if item[1] == max_val else acc,
            self._m.items(),
            [],
        )

        return result

    def dfs(self, root: Optional[TreeNode]):
        if not root:
            return

        self.dfs(root.left)
        self._m[root.val] += 1
        self.dfs(root.right)
