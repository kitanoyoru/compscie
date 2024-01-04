package main

func minOperations(nums []int) int {
	freq := findFreq(nums)

	result := 0
	for _, val := range freq {
		if val < 2 {
			return -1
		}

		result += val / 3
		if val%3 != 0 {
			result++
		}
	}

	return result
}

func findFreq(nums []int) map[int]int {
	m := make(map[int]int)
	for _, num := range nums {
		m[num]++
	}

	return m
}
