// Solved by @kitanoyoru
// https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/

const findSmallestSetOfVertices = (n: number, edges: number[][]): number[] => {
  const visited = new Array(n).fill(false)
  const arr: number[] = []

  for (const edge of edges) {
    if (visited[edge[1]]) {
      continue
    }
    visited[edge[1]] = true
  }

  visited.forEach((v, i) => {
    if (!v) {
      arr.push(i)
    }
  })

  return arr
}
