package main

import (
	"sort"
)

func OddSum(nums []int) int {
	s := 0

	for i, num := range nums {
		if i%2 == 0 {
			s += num
		}
	}

	return s
}

func arrayPairSum(nums []int) int {
	sort.Slice(nums, func(i, j int) bool {
		return nums[i] < nums[j]
	})

	return OddSum(nums)
}
