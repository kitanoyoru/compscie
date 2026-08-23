package main

func twoSum(nums []int, target int) []int {
	var result []int

	for i := range nums {
		for j := i+1; j < len(nums); j++ {
			if nums[i] + nums[j] == target {
				result = []int{i, j}
				break
			}
		}
	}

	return result
}

