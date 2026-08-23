package main

func repeatedNTimes(nums []int) int {
	n := len(nums) / 2 

	m := make(map[int]int, len(nums))
	for _, val := range nums {
		m[val]++

		if m[val] == n {
			return val
		}
	}

	return -1
}
