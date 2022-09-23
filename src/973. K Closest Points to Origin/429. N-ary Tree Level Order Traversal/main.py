# Solved by @kitanoyoru
# https://leetcode.com/problems/n-ary-tree-level-order-traversal/

"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

import queue

from typing import List


class Solution:
    def levelOrder(self, root: 'Node') -> List[List[int]]:
        if not root:
            return []
        ans: List[List[int]] = []
        q = queue.Queue()

        q.put(root)

        while not q.empty():
            level = []
            l = q.qsize()

            for _ in range(l):
                node = q.get()
                level.append(node.val)
                
                for n in node.children:
                    q.put(n)

            ans.append(level)

        return ans
