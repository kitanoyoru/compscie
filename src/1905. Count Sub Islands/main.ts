// 1905. Count Sub Islands solved by @kitanoyoru
// https://leetcode.com/problems/count-sub-islands/

type Queue = Array<{ x: number; y: number }>

const countSubIslands = (grid1: number[][], grid2: number[][]): number => {
  const rows: number = grid1.length
  const columns: number = grid1[0].length
  const visited: boolean[][] = []
  const grid: number[][] = []

  let count: number = 0

  for (let i = 0; i < rows; i++) {
    visited.push([])
    grid.push([])
    for (let j = 0; j < columns; j++) {
      visited[i].push(false)
      grid[i].push(0)
    }
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (grid2[x][y]) {
        dfs(x, y)
      }
    }
  }

  const dfs = (x: number, y: number) => {
    const q: Queue = []

    q.push({ x, y })
    visited[x][y] = true

    while (q.length > 0) {
      const { x, y } = q.pop() as { x: number; y: number }
      // north
      if (grid[x + 1] && !visited[x + 1][y] && grid[x + 1][y]) {
        q.push({ x: x + 1, y: y })
        visited[x + 1][y] = true
      }
      // east
      if (grid[x] && !visited[x][y + 1] && grid[x][y + 1]) {
        q.push({ x: x, y: y + 1 })
        visited[x][y + 1] = true
      }
      // south
      if (grid[x - 1] && !visited[x - 1][y] && grid[x - 1][y]) {
        q.push({ x: x - 1, y: y })
        visited[x - 1][y] = true
      }
      // west
      if (grid[x] && !visited[x][y - 1] && grid[x][y - 1]) {
        q.push({ x: x, y: y - 1 })
        visited[x][y - 1] = true
      }
    }
  }

  console.log(grid)

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (grid[x][y] && !visited[x][y]) {
        dfs(x, y)
        count++
      }
    }
  }

  return count
}

console.log(
  countSubIslands(
    [
      [1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
    ],
    [
      [1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 0, 0, 0],
      [1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0],
    ]
  )
)
