package main

func check(nums []int) bool {
	var (
		count = 0
		n = len(nums)
	)

	if n <= 1 {
		return true
	}

	for i := range nums {
		if nums[i] > nums[(i + 1) % n] {
			count++
		}
	}

	return count <= 1
}
