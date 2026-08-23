package main

type Position struct {
	X int
	Y int
}

var directions = []Position{
	{X: -1, Y: 0}, // Up
	{X: 0, Y: 1},  // Right
	{X: 1, Y: 0},  // Down
	{X: 0, Y: -1}, // Left
}

func findMaxFish(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])

	visited := make([][]bool, rows)
	for i := range visited {
		visited[i] = make([]bool, cols)
	}

	var dfs func(start Position) int
	dfs = func(start Position) int {
		x, y := start.X, start.Y
		if x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y] || grid[x][y] == 0 {
			return 0
		}

		visited[x][y] = true
		fish := grid[x][y]

		for _, direction := range directions {
			fish += dfs(Position{
				X: x + direction.X,
				Y: y + direction.Y,
			})
		}

		return fish
	}

	result := 0

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if grid[i][j] > 0 && !visited[i][j] {
				result = max(result, dfs(Position{X: i, Y: j}))
			}
		}
	}

	return result
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
