package main

func pivotIndex(nums []int) int {
	var total int
	for _, v := range nums {
		total += v
	}

	var prefix int
	for i, v := range nums {
		if prefix == total-prefix-v {
			return i
		}

		prefix += v
	}

	return -1
}
