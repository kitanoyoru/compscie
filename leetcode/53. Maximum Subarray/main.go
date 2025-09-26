package main

func maxSubArray(nums []int) int {
	result := nums[0]

	for i := 1; i < len(nums); i++ {
		nums[i] = max(nums[i], nums[i]+nums[i-1])
		result = max(result, nums[i])
	}

	return result
}

