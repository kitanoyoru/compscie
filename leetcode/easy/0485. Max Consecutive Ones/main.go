package main

func findMaxConsecutiveOnes(nums []int) int {
	var counter, result int

	for _, num := range nums {
		if num == 1 {
			counter++
		} else {
			result = max(result, counter)
			counter = 0
		}
	}

	if counter != 0 {
		result = max(result, counter)
	}

	return result
}
