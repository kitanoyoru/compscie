class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}


function treeSum(node: TreeNode | null): number {
  if (node === null) {
    return 0
  }

  return node.val + treeSum(node.left) + treeSum(node.right)
}


function maxProduct(root: TreeNode | null): number {
  const MOD = 1000000000 + 7

  let [totalTreeSum, result] = [treeSum(root), Number.MIN_VALUE]

  const traverse = (node: TreeNode | null): number => {
    if (node === null) {
      return 0
    }

    let [leftSum, rightSum] = [traverse(node.left), traverse(node.right)]

    result = Math.max(result, leftSum * (totalTreeSum - leftSum))
    result = Math.max(result, rightSum * (totalTreeSum - rightSum))

    return node.val + leftSum + rightSum
  }

  traverse(root)

  return result % MOD
};
