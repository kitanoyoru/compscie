// Solved by @kitanoyoru
// https://leetcode.com/problems/two-sum-iv-input-is-a-bst/

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

const inorderTraversal = (root: TreeNode | null, arr: number[]) => {
  if (!root) {
    return
  }
  inorderTraversal(root.left, arr)
  arr.push(root.val)
  inorderTraversal(root.right, arr)
}

const findTarget = (root: TreeNode | null, k: number): boolean => {
  let arr: number[] = []
  inorderTraversal(root, arr)

  let i = 0,
    j = arr.length - 1
  while (i < j) {
    if (arr[i] + arr[j] == k) {
      return true
    }
    if (arr[i] + arr[j] < k) {
      i++
    } else {
      j--
    }
  }

  return false
}

export {}
