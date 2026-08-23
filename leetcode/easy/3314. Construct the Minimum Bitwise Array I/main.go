package main

func minBitwiseArray(nums []int) []int {
	result := make([]int, len(nums))
	for i := range result {
		result[i] = -1
	}

	for idx, num := range nums {
		for i := range num {
			if i|(i+1) == num {
				result[idx] = i
				break
			}
		}
	}

	return result
}
