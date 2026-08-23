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

class BSTIterator {
  private st: TreeNode[] = []

  private pushToStack(root: TreeNode) {
    while (root != null) {
      this.st.push(root)
      root = root.left
    }
  }

  constructor(root: TreeNode | null) {
    this.pushToStack(root)
  }

  next(): number {
    const node: TreeNode = this.st.shift()!
    this.pushToStack(node.right)
    return node.val
  }

  hasNext(): boolean {
    return !this.st.length
  }
}

/**
 * Your BSTIterator object will be instantiated and called as such:
 * var obj = new BSTIterator(root)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */
