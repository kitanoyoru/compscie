package main

import "math"

func isTravelDay(days *[]int, i int) bool {
	for _, day := range *days {
		if day == i {
			return true
		}
	}

	return false
}

func min(args ...int) int {
	m := math.MaxInt
	for _, arg := range args {
		if arg < m {
			m = arg
		}
	}

	return m
}

func max(args ...int) int {
	m := math.MinInt
	for _, arg := range args {
		if arg > m {
			m = arg
		}
	}

	return m
}

func mincostTickets(days []int, costs []int) int {
	dp := make([]int, 366)

	for i := 1; i < 366; i++ {
		if !isTravelDay(&days, i) {
			dp[i] = dp[i-1]
		} else {
			dp[i] = min(dp[i-1]+costs[0], dp[max(0, i-7)]+costs[1], dp[max(0, i-30)]+costs[2])
		}
	}

	return dp[365]
}
