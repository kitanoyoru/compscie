class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def createBinaryTree(self, D: List[List[int]]) -> Optional[TreeNode]:
        d, child = dict(), set()

        for p, c, is_left in D:
            child.add(c)

            p_node = d.setdefault(p, TreeNode(p))
            c_node = d.setdefault(c, TreeNode(c))

            if is_left:
                p_node.left = c_node
            else:
                p_node.right = c_node

        return next(d[k] for k in d if k not in child)