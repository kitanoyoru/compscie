// 695. Max Area Of Island solved by @kitanoyoru
// https://leetcode.com/problems/max-area-of-island/

const maxAreaOfIsland = (grid: number[][]): number => {
  const rows: number = grid.length
  const columns: number = grid[0].length

  let areaArray: number[] = [0]
  let visited: boolean[][] = []

  const dfs = (x: number, y: number): number => {
    let q: number[][] = []
    let area: number = 0

    q.push([x, y])
    visited[x][y] = true

    while (q.length > 0) {
      const [x, y] = q.pop() as number[]
      ++area
      // north
      if (grid[x][y + 1] && !visited[x][y + 1] && grid[x][y + 1] == 1) {
        q.push([x, y + 1])
        visited[x][y + 1] = true
      }
      // east
      if (grid[x + 1] && !visited[x + 1][y] && grid[x + 1][y] == 1) {
        q.push([x + 1, y])
        visited[x + 1][y] = true
      }
      // south
      if (grid[x][y - 1] && !visited[x][y - 1] && grid[x][y - 1] == 1) {
        q.push([x, y - 1])
        visited[x][y - 1] = true
      }
      // west
      if (grid[x - 1] && !visited[x - 1][y] && grid[x - 1][y] == 1) {
        q.push([x - 1, y])
        visited[x - 1][y] = true
      }
    }

    return area
  }

  for (let i = 0; i < rows; ++i) {
    visited.push([])
    for (let j = 0; j < columns; ++j) {
      visited[i].push(false)
    }
  }

  let findedArea: number
  for (let x = 0; x < rows; ++x) {
    for (let y = 0; y < columns; ++y) {
      if (!visited[x][y] && grid[x][y] == 1) {
        findedArea = dfs(x, y)
        areaArray.push(findedArea)
      }
    }
  }

  return Math.max(...areaArray)
}
