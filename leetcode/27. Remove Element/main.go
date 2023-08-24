package main

func removeElement(nums []int, val int) int {
	pos := 0

	for i := 0; i < len(nums); i++ {
		if nums[i] == val {
			pos++
		} else {
			nums[i-pos] = nums[i]
		}
	}

	return len(nums) - pos
}
