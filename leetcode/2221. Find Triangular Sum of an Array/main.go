package main

func triangularSum(nums []int) int {
	if len(nums) == 1 {
		return nums[0]
	}

	newNums := make([]int, 0, len(nums)-1)

	for i := 0; i < len(nums) - 1; i++ {
		newNums = append(newNums, (nums[i]+nums[i+1])%10)
	}

	return triangularSum(newNums)
}

