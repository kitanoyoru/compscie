package main

const MOD = 1e9 + 7

func initDpArray(rows, cols int) [][]int {
	dp := make([][]int, rows)
	for i := range dp {
		dp[i] = make([]int, cols)
		for j := range dp[i] {
			dp[i][j] = -1
		}
	}

	return dp
}

func countPaths(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])

	ans := 0

	dp := initDpArray(rows, cols)

	DX := [4]int{-1, 1, 0, 0}
	DY := [4]int{0, 0, -1, 1}

	var findPaths func(x, y int) int
	findPaths = func(x, y int) int {
		paths := 1

		if dp[x][y] != -1 {
			return dp[x][y]
		}

		for i := 0; i < 4; i++ {
			nextX := x + DX[i]
			nextY := y + DY[i]

			if nextX >= 0 && nextX < rows && nextY >= 0 && nextY < cols && grid[x][y] < grid[nextX][nextY] {
				paths += findPaths(nextX, nextY)
			}

		}

		dp[x][y] = paths % MOD

		return dp[x][y]

	}

	for x := 0; x < rows; x++ {
		for y := 0; y < cols; y++ {
			ans += findPaths(x, y)

		}
	}

	return ans % MOD
}
