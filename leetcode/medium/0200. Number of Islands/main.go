package main

type Position struct {
	X int
	Y int
}

var directions = []Position{
	{X: -1, Y: 0},
	{X: 0, Y: 1},
	{X: 1, Y: 0},
	{X: 0, Y: -1},
}

func numIslands(grid [][]byte) int {
	rows, cols := len(grid), len(grid[0])

	visited := make([][]bool, rows)
	for i := 0; i < rows; i++ {
		visited[i] = make([]bool, cols)
	}

	var dfs func(start Position)
	dfs = func(start Position) {
		if start.X < 0 || start.X >= rows || start.Y < 0 || start.Y >= cols || visited[start.X][start.Y] || grid[start.X][start.Y] == '0' {
			return
		}

		visited[start.X][start.Y] = true

		for _, direction := range directions {
			dfs(Position{
				X: start.X + direction.X,
				Y: start.Y + direction.Y,
			})
		}
	}

	result := 0

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if !visited[i][j] && grid[i][j] == '1' {
				result += 1
				dfs(Position{
					X: i,
					Y: j,
				})
			}
		}
	}

	return result
}
