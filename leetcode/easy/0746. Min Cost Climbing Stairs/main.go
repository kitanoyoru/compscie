package main

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func minCostClimbingStairs(cost []int) int {
	a, b, c := cost[0], cost[1], 0

	if len(cost) < 3 {
		return min(a, b)
	}

	for i := 2; i < len(cost); i++ {
		c = cost[i] + min(a, b)
		a = b
		b = c
	}

	return min(a, b)
}
