package main

func longestMonotonicSubarray(nums []int) int {
	if len(nums) == 1 {
		return 1
	}

	var (
		maxLength  = 1
		incLength  = 1
		descLength = 1
	)
	for i := 1; i < len(nums); i++ {
		if nums[i] > nums[i-1] {
			incLength++
			descLength = 1
		} else if nums[i] < nums[i-1] {
			descLength++
			incLength = 1
		} else {
			incLength, descLength = 1, 1
		}

		maxLength = max(maxLength, incLength, descLength)
	}

	return maxLength
}
