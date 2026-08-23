package main

import "math"

func find132pattern(nums []int) bool {
	stack, last := []int{}, math.MinInt

	for i := len(nums) - 1; i >= 0; i-- {
		if nums[i] < last {
			return true
		}

		for len(stack) > 0 && stack[len(stack)-1] < nums[i] {
			last = stack[len(stack)-1]
			stack = stack[:len(stack)-1]
		}

		stack = append(stack, nums[i])
	}

	return false
}
