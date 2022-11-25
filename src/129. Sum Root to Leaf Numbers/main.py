# Solved by @kitanoyoru

from dataclasses import dataclass
from typing import Optional


@dataclass
class TreeNode:
    val: int
    left: Optional["TreeNode"]
    right: Optional["TreeNode"]


class Solution:
    def sumNumbers(self, root: Optional[TreeNode]) -> int:
        self.ans: int = 0

        self.sum_paths(root)

        return self.ans

    def sum_paths(self, root: Optional[TreeNode], path: int = 0) -> None:
        if not root:
            return

        path_sum: int = path * 10 + root.val

        if not root.left and not root.right:
            self.ans += path_sum
            return

        self.sum_paths(root.left, path_sum)
        self.sum_paths(root.right, path_sum)
