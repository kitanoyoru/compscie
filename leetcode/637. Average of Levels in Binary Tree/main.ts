// Solved by @kitanoyoru
// https://leetcode.com/problems/average-of-levels-in-binary-tree/

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

const averageOfLevels = (root: TreeNode | null): number[] => {
  let ans: number[] = [],
    val = 0
  let q: TreeNode[] = []

  q.push(root)

  while (q.length) {
    const len = q.length
    val = 0
    for (let i = 0; i < len; i++) {
      const node = q.shift()
      val += node.val
      if (node.left) {
        q.push(node.left)
      }
      if (node.right) {
        q.push(node.right)
      }
    }
    ans.push(val / len)
  }

  return ans
}
