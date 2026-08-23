// Solved by @kitanoyoru
// https://leetcode.com/problems/clone-graph/

class Node {
  val: number
  neighbors: Node[]
  constructor(val?: number, neighbors?: Node[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}

const graph = new Map<Number, Node>()

const cloneGraph = (node: Node | null): Node | null => {
  if (node == null) {
    return null
  }

  if (!graph.has(node.val)) {
    graph.set(node.val, new Node(node.val))
    for (const adj of node.neighbors) {
      graph.get(node.val)!.neighbors.push(cloneGraph(adj)!)
    }
  }

  return graph.get(node.val)!
}

export {}
