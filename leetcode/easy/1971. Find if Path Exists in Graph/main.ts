type Graph = Record<number, Array<number>>

const appendToGraph = (graph: Graph, key: number, value: number) => {
  if (!graph[key]) {
    graph[key] = [value]
  } else {
    graph[key].push(value)
  }
}

const validPath = (
  _: number,
  edges: number[][],
  source: number,
  destination: number
): boolean => {
  let graph: Graph = {}

  for (const edge of edges) {
    let [v, u] = [edge[0], edge[1]]
    appendToGraph(graph, v, u)
    appendToGraph(graph, u, v)
  }

  return dfs(graph, source, destination, new Set<number>())
}

const dfs = (
  graph: Graph,
  current: number,
  target: number,
  visited: Set<number>
): boolean => {
  if (current == target) {
    return true
  }

  if (visited.has(current)) {
    return false
  } else {
    visited.add(current)
  }

  for (const next of graph[current]) {
    if (dfs(graph, next, target, visited)) {
      return true
    }
  }

  return false
}
