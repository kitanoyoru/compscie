package main

func maximumTripletValue(nums []int) int64 {
	n := len(nums)
	if n < 3 {
		return 0
	}

	var (
		prefix = make([]int, n)
		suffix = make([]int, n)
	)

	prefix[0] = nums[0]
	for i := 1; i < n; i++ {
		prefix[i] = max(prefix[i-1], nums[i])
	}

	suffix[n-1] = nums[n-1]
	for i := n - 2; i >= 0; i-- {
		suffix[i] = max(suffix[i+1], nums[i])
	}

	var result int64
	for j := 1; j < n-1; j++ {
		maxLeft, maxRight := prefix[j-1], suffix[j+1]

		if maxLeft > nums[j] && maxRight > 0 {
			result = max64(result, int64((maxLeft-nums[j])*maxRight))
		}
	}

	return result
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func max64(a, b int64) int64 {
	if a > b {
		return a
	}

	return b
}
