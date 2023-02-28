package main

func minDistance(word1 string, word2 string) int {
	n, m := len(word1), len(word2)

	dp := [][]int{}

	for i := 0; i < n+1; i++ {
		buf := []int{}
		for j := 0; j < m+1; j++ {
			buf = append(buf, 0)
		}
		dp = append(dp, buf)
	}

	for i := 1; i <= n; i++ {
		dp[i][0] = i
	}

	for j := 1; j <= m; j++ {
		dp[0][j] = j
	}

	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if word1[i-1] == word2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1
			}
		}
	}

	return int(dp[n][m])
}

func min(a, b, c int) int {
	if a < b {
		if a < c {
			return a
		}
	} else {
		if b < c {
			return b
		}
	}

	return c
}
