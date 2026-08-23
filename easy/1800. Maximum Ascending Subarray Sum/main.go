package main

func maxAscendingSum(nums []int) int {
	result := nums[0]
	tempSum := nums[0]

	for i := 1; i < len(nums); i++ {
		if nums[i] > nums[i-1] {
			tempSum += nums[i]
		} else {
			result = max(result, tempSum)
			tempSum = nums[i]
		}
	}

	return max(result, tempSum)
}

