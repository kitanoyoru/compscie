package main

import "sort"

func maximumProduct(nums []int) int {
	sort.Ints(nums)

	n := len(nums)

	first := nums[0] * nums[1] * nums[n-1]
	second := nums[n-1] * nums[n-2] * nums[n-3]

	if first > second {
		return first
	}

	return second
}
