// Solved by @kitanoyoru
// https://leetcode.com/problems/path-sum-ii/

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

const pathSum = (root: TreeNode | null, targetSum: number): number[][] => {
  const ans: number[][] = []
  const dfs = (root: TreeNode | null, arr: number[], resSum: number) => {
    if (!root) {
      return
    }

    resSum -= root.val
    arr.push(root.val)

    if (!root.left && !root.right && resSum == 0) {
      ans.push([...arr])
    } else {
      dfs(root.left, arr, resSum)
      dfs(root.right, arr, resSum)
    }

    arr.pop()
  }

  dfs(root, [], targetSum)

  return ans
}
