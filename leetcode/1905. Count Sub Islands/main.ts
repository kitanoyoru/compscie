// 1905. Count Sub Islands solved by @kitanoyoru
// https://leetcode.com/problems/count-sub-islands/

type Queue = Array<{ row: number; column: number }>

// direction = [row, column]
const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

const dfs = (
  grid1: number[][],
  grid2: number[][],
  visited: boolean[][],
  rows: number,
  columns: number,
  startRow: number,
  startColumn: number
): boolean => {
  let q: Queue = [],
    isSubIsland = true

  q.push({ row: startRow, column: startColumn })
  visited[startRow][startColumn] = true

  while (q.length) {
    const { row, column } = q.shift()!
    if (grid1[row][column] == 0) {
      isSubIsland = false
    }
    for (let d of DIRECTIONS) {
      let nRow = row + d[0],
        nColumn = column + d[1]
      if (
        nRow >= 0 &&
        nRow < rows &&
        nColumn >= 0 &&
        nColumn < columns &&
        !visited[nRow][nColumn] &&
        grid2[nRow][nColumn]
      ) {
        visited[nRow][nColumn] = true
        q.push({ row: nRow, column: nColumn })
      }
    }
  }

  return isSubIsland
}

const countSubIslands = (grid1: number[][], grid2: number[][]) => {
  const rows = grid1.length,
    columns = grid1[0].length
  let visited: boolean[][] = [],
    count = 0

  for (let i = 0; i < rows; i++) {
    visited.push([])
    for (let j = 0; j < columns; j++) {
      visited[i].push(false)
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid2[i][j] && !visited[i][j]) {
        let isSubIsland = dfs(grid1, grid2, visited, rows, columns, i, j)
        if (isSubIsland) count++
      }
    }
  }

  return count
}
