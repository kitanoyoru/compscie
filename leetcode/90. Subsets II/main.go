package main

import "sort"

func subsetsWithDup(nums []int) [][]int {
	result := [][]int{}

	sort.Ints(nums)

	var backtrack func(start int, subset []int)
	backtrack = func(start int, subset []int) {
		temp := make([]int, len(subset))
		copy(temp, subset)
		result = append(result, temp)

		for i := start; i < len(nums); i++ {
			if i > start && nums[i] == nums[i-1] {
				continue
			}

			subset = append(subset, nums[i])
			backtrack(i+1, subset)
			subset = subset[:len(subset)-1]
		}
	}

	backtrack(0, []int{})

	return result
}

