package main

func countMaxOrSubsets(nums []int) int {
	var (
		result = 0
		maxOr  = 0
	)
	for _, num := range nums {
		maxOr |= num
	}

	backtrack(nums, 0, 0, maxOr, &result)

	return result
}

func backtrack(nums []int, idx, currOr, maxOr int, result *int) {
	if currOr == maxOr {
		*result += 1
	}

	for i := idx; i < len(nums); i++ {
		backtrack(nums, i+1, currOr|nums[i], maxOr, result)
	}
}
