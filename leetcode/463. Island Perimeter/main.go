package main

func islandPerimeter(grid [][]int) int {
	lands, neigh := 0, 0

	for i := range grid {
		for j := range grid[i] {
			if grid[i][j] == 1 {
				lands += 1
				if i < len(grid)-1 && grid[i+1][j] == 1 {
					neigh++
				}
				if j < len(grid[i])-1 && grid[i][j+1] == 1 {
					neigh++
				}
			}
		}
	}

	return 4*lands - 2*neigh
}
