// Solved by @kitanoyoru
// https://leetcode.com/problems/n-ary-tree-level-order-traversal/

/**
 * Definition for node.
 * class Node {
 *     val: number
 *     children: Node[]
 *     constructor(val?: number) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.children = []
 *     }
 * }
 */

const levelOrder = (root: Node | null): number[][] => {
  if (!root) {
    return []
  }
  let arr: number[][] = []

  let q: Node[] = []
  q.push(root)

  while (q.length) {
    let level: number[] = []
    let size = q.length
    for (let i = 0; i < size; i++) {
      let n = q.shift()!
      level.push(n.val)
      for (let u of n.children) {
        q.push(u)
      }
    }
    arr.push(level)
  }

  return arr
}
