package main

func initAvgRadiuses(n int) []int {
	avgRadiuses := make([]int, n)

	for i := 0; i < n; i++ {
		avgRadiuses[i] = -1
	}

	return avgRadiuses
}

func getAverages(nums []int, k int) []int {
	n := len(nums)

	avgRadiuses := initAvgRadiuses(n)

	if k > n/2 {
		return avgRadiuses
	}

	prefixSums := make([]int, n)
	prefixSums[0] = nums[0]

	for i := 1; i < n; i++ {
		prefixSums[i] = prefixSums[i-1] + nums[i]
	}

	sumBeforeI := 0
	for i := k; i < n-k; i++ {
		avgRadiuses[i] = (prefixSums[i+k] - sumBeforeI) / (2*k + 1)
		sumBeforeI = prefixSums[i-k]
	}

	return avgRadiuses
}
