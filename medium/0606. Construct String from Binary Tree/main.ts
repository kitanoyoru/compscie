// Solved by @kitanoyoru
// https://leetcode.com/problems/construct-string-from-binary-tree/

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

const tree2str = (root: TreeNode | null): string => {
  let ans = `${root.val}`
  const helper = (node: TreeNode | null) => {
    if (!node) {
      return
    }
    if (node.left) {
      ans += "(" + tree2str(node.left) + ")"
    }
    if (node.right) {
      if (!node.left) ans += "()"
      ans += "(" + tree2str(node.right) + ")"
    }
  }

  helper(root)

  return ans
}
