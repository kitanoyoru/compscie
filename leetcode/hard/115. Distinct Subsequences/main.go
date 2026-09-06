package main

func numDistinct(s, t string) int {
	m, n := len(s), len(t)
	if n > m {
		return 0
	}

	dp := make([]int, n+1)
	dp[0] = 1

	for i := 1; i <= m; i++ {
		for j := n; j >= 1; j-- {
			if s[i-1] == t[j-1] {
				dp[j] += dp[j-1]
			}
		}
	}

	return dp[n]
}
