package main

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func numMusicPlaylists(n int, goal int, k int) int {
	MOD := int(1e9 + 7)

	dp := [][]int{}
	for i := 0; i < n; i++ {
		temp := []int{}
		for j := 0; j < goal; j++ {
			temp = append(temp, -1)
		}
		dp = append(dp, temp)
	}

	var solve func(int, int) int
	solve = func(n, goal int) int {
		if n == 0 && goal == 0 {
			return 1
		}
		if n == 0 || goal == 0 {
			return 0
		}

		if dp[n][goal] != -1 {
			return dp[n][goal]
		}

		pick := solve(n-1, goal-1) * n
		notpick := solve(n, goal-1) * max(n-k, 0)

		dp[n][goal] = (pick + notpick) % MOD

		return dp[n][goal]

	}

	return solve(n, goal)
}
