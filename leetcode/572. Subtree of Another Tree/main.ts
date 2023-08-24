// Solved by @kitanoyoru
// https://leetcode.com/problems/subtree-of-another-tree/

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

const isEqual = (r1: TreeNode | null, r2: TreeNode | null): boolean => {
  if (!r1 && !r2) {
    return true
  }
  if (r1 && r2 && r1.val == r2.val) {
    return isEqual(r1.left, r2.left) && isEqual(r1.right, r2.right)
  } else {
    return false
  }
}

const isSubtree = (
  root: TreeNode | null,
  subRoot: TreeNode | null
): boolean => {
  if (root && subRoot) {
    const q: TreeNode[] = [root]
    while (q.length) {
      const level = q.length
      for (let i = 0; i < level; i++) {
        const node = q.shift()!
        if (node.right) {
          q.push(node.right)
        }
        if (node.left) {
          q.push(node.left)
        }
        if (node.val == subRoot.val) {
          if (isEqual(node, subRoot)) {
            return true
          }
        }
      }
    }

    return false
  }
}

export {}
