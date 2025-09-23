package main

func findTargetSumWays(nums []int, target int) int {
	var backtrack func(i, sum int) int
	backtrack = func(idx, sum int) int {
		if idx == len(nums) {
			if sum == target {
				return 1
			}

			return 0
		}

		return backtrack(idx+1, sum+nums[idx]) + backtrack(idx+1, sum-nums[idx])
	}

	return backtrack(0, 0)
}
