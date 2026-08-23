// Solved by @kitanoyoru
// https://binarysearch.com/problems/Only-Child

/**
 * class Tree {
 *     val: number;
 *     left: Tree | null;
 *     right: Tree | null;
 *
 *     constructor(val: number, left: Tree | null, right: Tree | null) {
 *         this.val = val
 *         this.left = left
 *         this.right = right
 *     }
 * }
 */

class Solution {
  constructor(private count = 0) {}

  solve(root: Tree): number {
    this.inorderTraversal(root)
    return this.count
  }

  inorderTraversal(root: Tree) {
    if (root == null) {
      return
    }
    this.inorderTraversal(root.left)
    if (
      (root.left != null && root.right == null) ||
      (root.right != null && root.left == null)
    ) {
      this.count++
    }
    this.inorderTraversal(root.right)
  }
}
