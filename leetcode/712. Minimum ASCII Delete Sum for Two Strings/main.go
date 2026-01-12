package main

func minimumDeleteSum(s1 string, s2 string) int {
	dp := make([][]int, len(s1)+1)
	for i := 0; i < len(s1)+1; i++ {
		dp[i] = make([]int, len(s2)+1)
	}

	for i := 1; i < len(s1)+1; i++ {
		dp[i][0] = dp[i-1][0] + int(s1[i-1])
	}

	for j := 1; j < len(s2)+1; j++ {
		dp[0][j] = dp[0][j-1] + int(s2[j-1])
	}

	for i := 1; i < len(s1)+1; i++ {
		for j := 1; j < len(s2)+1; j++ {
			if s1[i-1] == s2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				dp[i][j] = min(dp[i][j-1]+int(s2[j-1]), dp[i-1][j]+int(s1[i-1]))
			}
		}
	}

	return dp[len(s1)][len(s2)]
}
