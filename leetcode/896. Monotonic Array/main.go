package main

func isMonotonic(nums []int) bool {
	inc, dec := false, false

	for i := 1; i < len(nums); i++ {
		if nums[i] < nums[i-1] {
			inc = true
		} else if nums[i] > nums[i-1] {
			dec = true
		}
	}

	return !(inc && dec)
}
