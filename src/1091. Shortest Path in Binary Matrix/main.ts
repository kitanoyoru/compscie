// Solved by @kitanoyoru
// https://leetcode.com/problems/shortest-path-in-binary-matrix/

type Queue = { row: number; column: number }

const DISTANCES = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1 - 1],
]

const shortestPathBinaryMatrix = (grid: number[][]): number => {
  if (grid[0][0]) {
    return -1;
  }
  const rows = grid.length,
    columns = grid[0].length

  let dist: number[][] = []

  let q: Queue[] = []
  let v: boolean[][] = []

  for (let i = 0; i < rows; i++) {
    v.push([] as boolean[])
    dist.push([] as number[])
    for (let j = 0; j < columns; j++) {
      v[i].push(false)
      dist[i].push(Infinity)
    }
  }

  q.push({ row: 0, column: 0 })
  dist[0][0] = 0
  v[0][0] = true

  while (q.length) {
    const { row, column } = q.shift()!
    for (let d of DISTANCES) {
      let newRow = row + d[0],
        newColumn = column + d[1]
      if (
        newRow >= 0 &&
        newRow < rows &&
        newColumn >= 0 &&
        newColumn < columns &&
        !grid[newRow][newColumn] &&
        !v[newRow][newColumn]
      ) {
        v[newRow][newColumn] = true
        dist[newRow][newColumn] = dist[row][column] + 1
        q.push({row: newRow, column: newColumn});
      }
    }
  }
  console.log(dist);
  return Number.isFinite(dist[rows-1][columns-1]) ? dist[rows-1][columns-1] + 1 : -1;
}
