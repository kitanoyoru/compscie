class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def trimBST(
        self, root: Optional[TreeNode], low: int, high: int
    ) -> Optional[TreeNode]:
        self.low, self.high = low, high
        return self.dfs(root)

    def dfs(self, node: Optional[TreeNode]) -> Optional[TreeNode]:
        if node is None:
            return None

        node.left = self.dfs(node.left)
        node.right = self.dfs(node.right)

        if self.low <= node.val <= self.high:
            return node
        elif self.low > node.val:
            return node.right
        else:
            return node.left
