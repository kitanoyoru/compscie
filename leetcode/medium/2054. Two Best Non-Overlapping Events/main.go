package main

import "sort"

func maxTwoEvents(events [][]int) int {
	sort.Slice(events, func(i, j int) bool {
		return events[i][1] < events[j][1]
	})

	n := len(events)
	dp := make([]int, n)

	for i := 0; i < n; i++ {
		dp[i] = events[i][2]
		if i > 0 && dp[i-1] > dp[i] {
			dp[i] = dp[i-1]
		}
	}

	result := 0
	for i := 0; i < n; i++ {
		left, right := 0, i-1
		prev := -1

		for left <= right {
			mid := (left + right) / 2
			if events[mid][1] < events[i][0] {
				prev = mid
				left = mid + 1
			} else {
				right = mid - 1
			}
		}

		value := events[i][2]
		if prev != -1 {
			value += dp[prev]
		}

		if value > result {
			result = value
		}
	}

	return result
}
