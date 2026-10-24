package main

import "math"

func dominantIndex(nums []int) int {
	largest, idx := findLargest(nums)

	for i, num := range nums {
		if largest < 2*num && i != idx {
			return -1
		}
	}

	return idx
}

func findLargest(nums []int) (int, int) {
	var (
		res = math.MinInt
		idx int
	)

	for i, num := range nums {
		if num > res {
			res = num
			idx = i
		}
	}

	return res, idx
}
