package main

func mostPoints(questions [][]int) int64 {
	dp := make([]int, len(questions))

	for i := len(questions) - 1; i >= 0; i-- {
		idx := i + questions[i][1] + 1

		if idx < len(questions) {
			dp[i] = dp[idx] + questions[i][0]
		} else {
			dp[i] = questions[i][0]
		}

		if i < len(questions)-1 {
			dp[i] = max(dp[i+1], dp[i])
		}
	}

	return int64(dp[0])
}
