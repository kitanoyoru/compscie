package main

func closedIsland(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])

	visited := make([][]bool, 0, rows)
	for i := 0; i < rows; i++ {
		v := make([]bool, 0, cols)
		for j := 0; j < cols; j++ {
			v = append(v, false)
		}
		visited = append(visited, v)
	}

	var dfs func(x, y int)
	dfs = func(x, y int) {
		q := [][]int{}

		q = append(q, []int{x, y})
		visitd[x][y] = true

		for len(q) > 0 {
			item := q[0]
			q = q[1:]

			x, y := item[0], item[1]

			if 


		}

	}

}
