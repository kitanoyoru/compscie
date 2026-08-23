package main

const Mod = 1000000007

func kInversePairs(n int, k int) int {
	dp := [1001][1001]int{}

	dp[0][0] = 1

	for i := 1; i <= n; i++ {
		for j := 0; j <= k; j++ {
			for x := 0; x <= min(j, i-1); x++ {
				if j-x >= 0 {
					dp[i][j] = (dp[i][j] + dp[i-1][j-x]) % Mod
				}
			}
		}
	}

	return dp[n][k]
}
