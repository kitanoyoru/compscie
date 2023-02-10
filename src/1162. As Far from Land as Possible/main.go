package main

func maxDistance(grid [][]int) int {
	var distances = [][]int{
		{-1, 0},
		{0, 1},
		{1, 0},
		{0, -1},
	}

	ans := -1
	rows, cols := len(grid), len(grid[0])

	q := [][]int{}
	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if grid[i][j] == 1 {
				q = append(q, []int{i, j})
			}
		}
	}

	if len(q) == 0 || rows*cols == len(q) {
		return -1
	}

	for len(q) > 0 {
		for count := len(q); count > 0; count-- {
			el := q[0]
			q = q[1:]
			for _, d := range distances {
				newRow := el[0] + d[0]
				newCol := el[1] + d[1]
				if newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grid[newRow][newCol] == 0 {
					q = append(q, []int{newRow, newCol})
					grid[newRow][newCol] = 1
				}
			}
		}
		ans++
	}

	return ans
}
