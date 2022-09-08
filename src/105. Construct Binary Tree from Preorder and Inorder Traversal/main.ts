// Solved by @kitanoyoru
// https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

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

const buildTree = (
  preorder: number[],
  inorder: number[]
): Optional<TreeNode> => {
  if (preorder.length == 1) return new TreeNode(preorder[0])

  let ps = 0,
    pe = preorder.length - 1
  let is = 0,
    ie = inorder.length - 1

  let mp = new Map<number, number>()
  for (let i = is; i <= ie; i++) {
    mp.set(inorder[i], i)
  }

  const helper = (ps: number, pe: number, is: number, ie: number) => {
    if (ps > pe || is > ie) return null

    const root = new TreeNode(preorder[ps])
    const el = mp.get(root.val)!
    const nel = el - is

    root.left = helper(ps + 1, ps + nel, is, el - 1)
    root.right = helper(ps + nel + 1, pe, el + 1, ie)

    return root
  }

  return helper(ps, pe, is, ie)
}

export {}
