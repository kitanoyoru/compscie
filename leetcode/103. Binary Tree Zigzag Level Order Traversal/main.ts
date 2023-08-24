// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/

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

type Optional<T> = T | null

const zigzagLevelOrder = (root: Optional<TreeNode>): number[][] => {
  if (!root) {
    return []
  }
  const ans: number[][] = []
  const q: TreeNode[] = []
  let direction = true // if true then left -> right

  q.push(root)

  while (q.length) {
    const len = q.length
    const level = []

    for (let i = 0; i < len; i++) {
      const node = q.shift()!
      level.push(node.val)
      if (node.left) q.push(node.left)
      if (node.right) q.push(node.right)
    }

    if (direction) {
      ans.push(level)
      direction = !direction
    } else {
      ans.push(level.reverse())
      direction = !direction
    }
  }

  return ans
}

export {}
