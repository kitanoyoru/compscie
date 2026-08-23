package main

func minBitwiseArray(nums []int) []int {
	result := make([]int, len(nums))

	for idx, num := range nums {
		if num != 2 {
			result[idx] = num - ((num+1)&(-num-1))/2
		} else {
			result[idx] = -1
		}
	}

	return result
}
