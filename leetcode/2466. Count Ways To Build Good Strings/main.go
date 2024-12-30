package main

const MOD = 1e9 + 7

func countGoodStrings(low int, high int, zero int, one int) int {
	dp := make(map[int]int)

	var dfs func(length int) int
	dfs = func(length int) int {
		if length > high {
			return 0
		}

		if val, ok := dp[length]; ok {
			return val
		}

		var res int
		if length >= low {
			res = 1
		}

		res += dfs(length+zero) + dfs(length+one)

		dp[length] = res % MOD

		return res % MOD
	}

	return dfs(0)
}
