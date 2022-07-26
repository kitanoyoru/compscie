// Solved by @kitanoyoru
// https://leetcode.com/problems/pacific-atlantic-water-flow/

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

const dfs = (
  heights: number[][],
  rows: number,
  columns: number,
  startRow: number,
  startColumn: number
): boolean => {
  let q: number[][] = [],
    pacific = false,
    atlantic = false,
    visited: boolean[][] = []

  for (let i = 0; i < rows; i++) {
    visited.push([])
    for (let j = 0; j < columns; j++) {
      visited[i].push(false)
    }
  }

  q.push([startRow, startColumn])
  visited[startRow][startColumn] = true

  while (q.length) {
    const [row, column] = q.pop()!
    for (let d of DIRECTIONS) {
      const newRow = row + d[0],
        newColumn = column + d[1]

      if (newRow < 0 || newColumn < 0) {
        pacific = true
        continue
      }
      if (newRow >= rows || newColumn >= columns) {
        atlantic = true
        continue
      }
      if (
        heights[newRow][newColumn] <= heights[row][column] &&
        !visited[newRow][newColumn]
      ) {
        visited[newRow][newColumn] = true
        q.push([newRow, newColumn])
      }
    }
  }

  return pacific && atlantic
}

const pacificAtlantic = (heights: number[][]): number[][] => {
  const rows = heights.length,
    columns = heights[0].length,
    ans: number[][] = []

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let result = dfs(heights, rows, columns, i, j)
      if (result) {
        ans.push([i, j])
      }
    }
  }

  return ans
}
