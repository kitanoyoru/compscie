package main

func getLastMoment(n int, left []int, right []int) int {
	maxT := 0

	for _, v := range right {
		maxT = max(maxT, n-v)
	}

	for _, v := range left {
		maxT = max(maxT, v)
	}

	return maxT
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}
