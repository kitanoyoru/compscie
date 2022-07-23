// 1254. Number of Closed Islands solved by @kitanoyoru
// https://leetcode.com/problems/number-of-closed-islands/

const closedIsland = (grid: number[][]): number => {
  const rows: number = grid.length
  const columns: number = grid[0].length

  let count: number = 0
  let visited: boolean[][] = []

  for (let i = 0; i < rows; ++i) {
    visited.push([])
    for (let j = 0; j < columns; ++j) {
      visited[i].push(false)
    }
  }

  const dfs = (x: number, y: number) => {
    let q: number[][] = []

    q.push([x, y])
    visited[x][y] = true

    while (q.length > 0) {
      const [x, y] = q.pop() as number[]
      // east
      if (!grid[x][y + 1] && !visited[x][y + 1] && grid[x][y + 1] == 0) {
        q.push([x, y + 1])
        visited[x][y + 1] = true
      }
      // north
      if (grid[x + 1] && !visited[x + 1][y] && grid[x + 1][y] == 0) {
        q.push([x + 1, y])
        visited[x + 1][y] = true
      }
      // west
      if (!grid[x][y - 1] && !visited[x][y - 1] && grid[x][y - 1] == 0) {
        q.push([x, y - 1])
        visited[x][y - 1] = true
      }
      // south
      if (grid[x - 1] && !visited[x - 1][y] && grid[x - 1][y] == 0) {
        q.push([x - 1, y])
        visited[x - 1][y] = true
      }
    }
  }

  for (let y = 0; y < columns; ++y) {
    if (y == 0 || y == columns - 1) {
      for (let x = 0; x < rows; ++x) {
        if (!visited[x][y] && grid[x][y] == 0) {
          dfs(x, y)
        }
      }
    }
    if (!visited[0][y] && grid[0][y] == 0) {
      dfs(0, y)
    }
    if (!visited[rows - 1][y] && grid[rows - 1][y] == 0) {
      dfs(rows - 1, y)
    }
  }

  for (let x = 1; x < rows - 1; ++x) {
    for (let y = 1; y < columns - 1; ++y) {
      if (!visited[x][y] && grid[x][y] == 0) {
        count++
        dfs(x, y)
      }
    }
  }

  return count
}
