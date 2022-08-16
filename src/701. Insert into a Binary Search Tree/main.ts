// Solved by @kitanoyoru
// https://leetcode.com/problems/insert-into-a-binary-search-tree/

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

const insertIntoBST = (root: TreeNode | null, val: number): TreeNode | null => {
  const insertedNode = new TreeNode(val)
  if (!root) {
    return insertedNode
  }
  const helper = (node: TreeNode | null): void => {
    if (node.val < val) {
      if (!node.right) {
        node.right = insertedNode
        return
      }
      return helper(node.right)
    } else if (node.val > val) {
      if (!node.left) {
        node.left = insertedNode
        return
      }
      return helper(node.left)
    }
  }

  helper(root)

  return root
}
