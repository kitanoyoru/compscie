package main

func maxInt(a, b int) int {
	if a < b {
		return b
	}

	return a
}

func matrixScore(grid [][]int) int {
	n, m := len(grid), len(grid[0])

	res := (1 << (m - 1)) * n

	for i := 1; i < m; i++ {
		val, set := 1<<(m-1-i), 0
		for j := 0; j < n; j++ {
			if grid[j][i] == grid[j][0] {
				set++
			}
		}

		res += max(set, n-set) * val
	}

	return res
}
