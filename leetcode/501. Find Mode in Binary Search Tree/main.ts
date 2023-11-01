class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

type OptionalNode = TreeNode | null

const findMode = (root: OptionalNode): number[] => {
    const m = new Map<number, number>()

    const dfs = (node: OptionalNode) => {
        if (!node) {
            return
        }

        dfs(node.left)
        m.set(node.val, (m.get(node.val) ?? 0) + 1)
        dfs(node.right)
    }

    dfs(root)

    const maxValue = Math.max(...m.values())
    const result = Array.from(m.entries()).reduce((prev, item) => {
        if (item[1] === maxValue) {
            return [...prev, item[0]];
        }
        return prev;
    }, []);

    return result
}
