// Solved by @kitanoyoru
// https://leetcode.com/problems/recover-binary-search-tree/

type Optional<T> = T | null

let first: Optional<TreeNode> = null
let second: Optional<TreeNode> = null
let prev: Optional<TreeNode> = new TreeNode(Number.MIN_SAFE_INTEGER)

const inorderTraversal = (node: Optional<TreeNode>): void => {
  if (node == null) {
    return
  }

  inorderTraversal(node.left)

  if (first == null && prev.val >= node.val) {
    first = prev
  }
  if (first != null && prev.val >= node.val) {
    second = node
  }
  prev = node

  inorderTraversal(node.right)
}

const swap = (first: Optional<TreeNode>, second: Optional<TreeNode>): void => {
  let temp = first.val
  first.val = second.val
  second.val = temp
}

const recoverTree = (root: Optional<TreeNode>): void => {
  inorderTraversal(root)
  swap(first, second)
}

export {}
