// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-level-order-traversal/

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

const levelOrder = (root: TreeNode | null): number[][] => {
  let hm: number[][] = []
  if (!root) {
    return hm
  }

  let q: TreeNode[] = []
  q.push(root)

  while (q.length) {
    let count = q.length
    let level: number[] = []

    while (count--) {
      let node = q.shift()!
      level.push(node.val)
      if (node.left) {
        q.push(node.left)
      }
      if (node.right) {
        q.push(node.right)
      }
    }

    hm.push(level)
  }

  return hm
}

export {}
