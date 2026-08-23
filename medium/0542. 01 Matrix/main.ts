// Solved by @kitanoyoru
// https://leetcode.com/problems/01-matrix/

type Queue = Array<{ row: number; column: number }>

const DISTANCE = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

const updateMatrix = (mat: number[][]): number[][] => {
  const rows = mat.length,
    columns = mat[0].length
  let visited: boolean[][] = []
  let q: Queue = []

  for (let i = 0; i < rows; i++) {
    visited.push([])
    for (let j = 0; j < columns; j++) {
      if (!mat[i][j]) {
        q.push({ row: i, column: j })
        visited[i].push(true)
      } else {
        visited[i].push(false)
      }
    }
  }

  while (q.length) {
    let { row, column } = q.shift()!
    for (let d of DISTANCE) {
      let newRow = row + d[0]
      let newColumn = column + d[1]
      if (
        newColumn >= 0 &&
        newColumn < columns &&
        newRow >= 0 &&
        newRow < rows &&
        !visited[newRow][newColumn]
      ) {
        mat[newRow][newColumn] = mat[row][column] + 1
        q.push({ row: newRow, column: newColumn })
        visited[newRow][newColumn] = true
      }
    }
  }

  return mat
}
