// 1020 Number of Enclaves solved by @kitanoyoru
// https://leetcode.com/problems/number-of-enclaves/

const numEnclaves = (grid: number[][]): number => {
  const rows = grid.length
  const columns = grid[0].length

  let counter: number = 0
  let visited: boolean[][] = []

  for (let i = 0; i < rows; i++) {
    visited.push([])
    for (let j = 0; j < columns; j++) {
      visited[i].push(false)
    }
  }

  const dfs = (x: number, y: number): void => {
    let q: number[][] = []

    q.push([x, y])
    visited[x][y] = true

    while (q.length > 0) {
      counter++
      const [x, y] = q.pop() as number[]

      if (grid[x + 1] && !visited[x + 1][y] && grid[x + 1][y] == 1) {
        q.push([x + 1, y])
        visited[x + 1][y] = true
      }
      if (grid[x][y + 1] && !visited[x][y + 1]) {
        q.push([x, y + 1])
        visited[x][y + 1] = true
      }
      if (grid[x - 1] && !visited[x - 1][y] && grid[x - 1][y] == 1) {
        q.push([x - 1, y])
        visited[x - 1][y] = true
      }
      if (grid[x][y - 1] && !visited[x][y - 1]) {
        q.push([x, y - 1])
        visited[x][y - 1] = true
      }
    }
  }

  for (let y = 0; y < columns; y++) {
    if (y == 0 || y == columns - 1) {
      for (let x = 0; x < rows; x++) {
        if (!visited[x][y] && grid[x][y]) dfs(x, y)
      }
    }
    if (!visited[0][y] && grid[0][y]) {
      dfs(0, y)
    }
    if (!visited[rows - 1][y] && grid[rows - 1][y]) {
      dfs(rows - 1, y)
    }
  }

  counter = 0

  for (let x = 1; x < rows - 1; x++) {
    for (let y = 1; y < columns - 1; y++) {
      if (!visited[x][y] && grid[x][y]) {
        dfs(x, y)
      }
    }
  }

  return counter
}

console.log(
  numEnclaves([
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ])
)

// 0 0 0 0
// 1 0 1 0
// 0 1 1 0
// 0 0 0 0
