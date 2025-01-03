package main

func waysToSplitArray(nums []int) int {
	var result, prefixSum, arraySum int

	for _, num := range nums {
		arraySum += num
	}

	for i := 0; i < len(nums)-1; i++ {
		prefixSum += nums[i]

		if prefixSum >= arraySum-prefixSum {
			result++
		}
	}

	return result
}
