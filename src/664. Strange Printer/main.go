package main

type Number interface {
	int | int32 | int64 | float32 | float64
}

func min[T Number](a, b T) T {
	if a < b {
		return a
	}

	return b
}

func strangePrinter(s string) int {
	n := len(s)

	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}

	for i := n - 1; i > -1; i-- {
		dp[i][i] = 1
		for j := i + 1; j < n; j++ {
			dp[i][j] = dp[i][j-1] + 1
			for k := i; k < j; k++ {
				if s[k] == s[j] {
					if k+1 <= j-1 {
						dp[i][j] = min(dp[i][j], dp[i][k]+dp[k+1][j-1])
					} else {
						dp[i][j] = min(dp[i][j], dp[i][k])
					}
				}
			}
		}
	}

	return dp[0][n-1]
}
