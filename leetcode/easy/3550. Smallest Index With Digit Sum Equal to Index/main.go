package main

import "math"

func smallestIndex(nums []int) int {
	result := math.MaxInt

	for i, num := range nums {
		if digitSum(num) == i {
			result = min(result, i)
		}
	}

	if result == math.MaxInt {
		return -1
	}

	return result
}

func digitSum(num int) int {
	result := 0

	for num > 0 {
		result += num % 10
		num /= 10
	}

	return result
}
