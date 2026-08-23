package main

func sumInts(nums []int) int {
	s := 0

	for _, num := range nums {
		s += num
	}

	return s
}

func createDpArray(size, defaultValue int) []int {
	dp := make([]int, size)
	for i := 0; i < size; i++ {
		dp[i] = defaultValue
	}

	dp[0] = 0

	return dp

}

func maxInt(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func minInt(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func absInt(a int) int {
	if a < 0 {
		return -a
	}

	return a
}

func tallestBillboard(rods []int) int {
	rodsSum := sumInts(rods)

	dp := createDpArray(rodsSum+1, -1)
	curr := make([]int, len(dp))

	for _, rod := range rods {
		copy(curr, dp)
		for i := 0; i <= rodsSum-rod; i++ {
			if curr[i] < 0 {
				continue
			}

			dp[i+rod] = maxInt(dp[i+rod], curr[i])
			dp[absInt(i-rod)] = maxInt(dp[absInt(i-rod)], curr[i]+minInt(rod, i))
		}
	}

	return dp[0]
}
