package main

func kLengthApart(nums []int, k int) bool {
	prevOneIdx := -1

	for idx, num := range nums {
		if num == 1 {
			if prevOneIdx == -1 {
				prevOneIdx = idx
				continue
			}

			if abs(prevOneIdx-idx)-1 < k {
				return false
			}

			prevOneIdx = idx
		}
	}

	return true
}

func abs(value int) int {
	if value < 0 {
		return -value
	}

	return value
}
