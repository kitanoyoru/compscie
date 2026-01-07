from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    _MOD = 10 ** 9 + 7

    def maxProduct(self, root: Optional[TreeNode]) -> int:
        result = 0
        totalSum = self.treeSum(root)

        def traverse(node: Optional[TreeNode]) -> int:
            nonlocal result

            if node is None:
                return 0

            leftSum = traverse(node.left)
            rightSum = traverse(node.right)

            subtreeSum = node.val + leftSum + rightSum
            result = max(result, subtreeSum * (totalSum - subtreeSum))

            return subtreeSum

        traverse(root)

        return result % Solution._MOD

    def treeSum(self, node: Optional[TreeNode]) -> int:
        if node is None:
            return 0
        return node.val + self.treeSum(node.left) + self.treeSum(node.right)
