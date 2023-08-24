// Solved by @kitanoyoru
// https://binarysearch.com/problems/Bipartite-Graph

class Solution {
  solve(graph: Array<Array<number>>): boolean {
    let q: number[] = [],
      colors = new Array(graph.length)

    q.push(0)
    colors[0] = 1

    while (q.length) {
      const v = q.shift()!
      if (graph[v].includes(v)) {
        return false
      }
      for (let u of graph[v]) {
        if (!colors[u]) {
          colors[u] = 1 - colors[v]
          q.push(u)
        } else if (colors[u] == colors[v]) {
          return false
        }
      }
    }

    return colors.includes(undefined) ? false : true
  }
}
