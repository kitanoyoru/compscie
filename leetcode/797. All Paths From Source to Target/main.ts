// Solved by @kitanoyoru
// https://leetcode.com/problems/all-paths-from-source-to-target/

const allPathsSourceTarget = (graph: number[][]): number[][] => {
  let ans: number[][] = []

  const dfs = (v: number, path: number[]) => {
    if (v == graph.length - 1) {
      ans.push(path)
      return
    }
    for (let u of graph[v]) {
      dfs(u, [...path, u])
    }
  }

  dfs(0, [0])

  return ans
}

console.log(allPathsSourceTarget([[1, 2], [3], [3], []]))

export {}
