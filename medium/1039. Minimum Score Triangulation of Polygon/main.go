package main

import "math"

func minScoreTriangulation(values []int) int {
	n := len(values)
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}

	var helper func(i, j int) int
	helper = func(i, j int) int {
		if j == 0 {
			j = n - 1
		}
		if dp[i][j] != 0 {
			return dp[i][j]
		}
		if j-i < 2 {
			return 0
		}

		res := math.MaxInt32
		for k := i + 1; k < j; k++ {
			weight := helper(i, k) + values[i]*values[k]*values[j] + helper(k, j)
			res = min(res, weight)
		}

		dp[i][j] = res

		return res
	}

	return helper(0, n-1)
}
