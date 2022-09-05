# Solved by @kitanoyoru
# https://leetcode.com/problems/path-sum-ii/

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional, List


class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        ans = []

        def dfs(node: Optional[TreeNode], arr: List[int], resSum: int):
            if node == None:
                return

            arr.append(node.val);
            resSum -= node.val;

            if node.left == None and node.right == None and resSum == 0:
                ans.append(arr[:])
            else:
                dfs(node.left, arr, resSum)
                dfs(node.right, arr, resSum)

            arr.pop()

        dfs(root, [], targetSum)
        
        return ans
        
