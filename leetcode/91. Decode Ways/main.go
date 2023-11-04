package main

import (
	"strconv"
)

func numDecodings(s string) int {
	n := len(s)

	dp := make([]int, n+1)
	dp[n] = 1

	for i := n - 1; i > -1; i-- {
		for j := i; j < n; j++ {
			n, _ := strconv.Atoi(s[i : j+1])
			if 1 <= n && n <= 26 {
				dp[i] += dp[j+1]
			} else {
				break
			}
		}
	}

	return dp[0]
}
