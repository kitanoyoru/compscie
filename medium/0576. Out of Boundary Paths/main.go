package main

const Modulo = 1e9 + 7

func findPaths(m int, n int, maxMove int, startRow int, startColumn int) int {
	dp := initGridDP(m, n)

	dp[startRow][startColumn] = 1
	count := 0

	for move := 1; move <= maxMove; move++ {
		newDP := initGridDP(m, n)
		for i := 0; i < m; i++ {
			for j := 0; j < n; j++ {
				if i == 0 {
					count = (count + dp[i][j]) % Modulo
				}
				if j == 0 {
					count = (count + dp[i][j]) % Modulo
				}
				if i == m-1 {
					count = (count + dp[i][j]) % Modulo
				}
				if j == n-1 {
					count = (count + dp[i][j]) % Modulo
				}

				if i > 0 {
					newDP[i][j] += dp[i-1][j]
				}
				if i < m-1 {
					newDP[i][j] += dp[i+1][j]
				}

				newDP[i][j] = newDP[i][j] % Modulo

				if j > 0 {
					newDP[i][j] += dp[i][j-1]
				}
				if j < n-1 {
					newDP[i][j] += dp[i][j+1]
				}

				newDP[i][j] = newDP[i][j] % Modulo
			}
		}

		dp = newDP
	}

	return count
}

func initGridDP(rows, cols int) [][]int {
	dp := make([][]int, rows)
	for i := range dp {
		dp[i] = make([]int, cols)
	}

	return dp
}
