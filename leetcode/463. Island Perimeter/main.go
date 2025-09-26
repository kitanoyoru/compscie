package main

type cell struct {
	x, y int
}

func islandPerimeter(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}

	visited := make(map[cell]struct{})
	directions := [][]int{{1, 0}, {0, 1}, {-1, 0}, {0, -1}}

	var perimeter int

	var dfs func(y, x int)
	dfs = func(y, x int) {
		if y < 0 || y >= len(grid) || x < 0 || x >= len(grid[0]) {
			return
		}

		if grid[y][x] == 0 {
			return
		}

		if _, ok := visited[cell{x, y}]; ok {
			return
		}

		visited[cell{x, y}] = struct{}{}

		for _, d := range directions {
			ny, nx := y+d[1], x+d[0]
			if ny < 0 || ny >= len(grid) || nx < 0 || nx >= len(grid[0]) || grid[ny][nx] == 0 {
				perimeter++
			} else {
				dfs(ny, nx)
			}
		}
	}

	for y := range len(grid) {
		for x := range len(grid[0]) {
			if grid[y][x] == 1 {
				dfs(y, x)
				break
			}
		}
	}

	return perimeter
}
