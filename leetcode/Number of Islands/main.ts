// Solved by @kitanoyoru
// https://binarysearch.com/problems/Number-of-Islands

type Queue = Array<{ row: number; column: number }>

class Solution {
  DIRECTIONS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ]

  solve(matrix: number[][]): number {
    const rows = matrix.length,
      columns = matrix[0].length
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
        if (matrix[i][j] && !visited[i][j]) {
          this.dfs(matrix, visited, rows, columns, i, j)
          count++
        }
      }
    }

    return count
  }

  dfs(
    matrix: number[][],
    visited: boolean[][],
    rows: number,
    columns: number,
    startRow: number,
    startColumn: number
  ) {
    let q: Queue = []

    q.push({ row: startRow, column: startColumn })
    visited[startRow][startColumn] = true

    while (q.length) {
      const { row, column } = q.shift()!
      for (let d of this.DIRECTIONS) {
        const nRow = row + d[0],
          nColumn = column + d[1]
        if (
          nRow >= 0 &&
          nRow < rows &&
          nColumn >= 0 &&
          nColumn < columns &&
          matrix[nRow][nColumn] &&
          !visited[nRow][nColumn]
        ) {
          visited[nRow][nColumn] = true
          q.push({ row: nRow, column: nColumn })
        }
      }
    }
  }
}
