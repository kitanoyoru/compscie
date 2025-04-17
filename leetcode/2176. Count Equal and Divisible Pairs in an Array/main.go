package main

func countPairs(nums []int, k int) int {
	var result int

	for i := range nums {
		for j := i + 1; j < len(nums); j++ {
			if (nums[i] == nums[j]) && (i*j)%k == 0 {
				result++
			}
		}
	}

	return result
}
