package main

import (
	"sort"
)

func sum(nums []int) int {
	s := 0

	for _, num := range nums {
		s += num
	}

	return s
}

func minSubsequence(nums []int) []int {
	sort.Slice(nums, func(i, j int) bool {
		return nums[i] > nums[j]
	})

	totalSum := sum(nums)
	currSum := 0

	for i, num := range nums {
		currSum += num
		if currSum > totalSum-currSum {
			return nums[:i+1]
		}
	}

	return []int{}
}
