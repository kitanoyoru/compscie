// Solved by @kitanoyoru
// https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/

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

const sortedArrayToBST = (nums: number[]): TreeNode | null => {
  const helper = (left: number, right: number): TreeNode | null => {
    if (left > right) {
      return null
    }

    const mid = Math.floor((left + right) / 2)
    const node = new TreeNode(nums[mid])

    node.left = helper(left, mid - 1)
    node.right = helper(mid + 1, right)

    return node
  }

  const ans = helper(0, nums.length - 1)

  return ans
}
