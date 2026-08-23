package main

func removeElement(nums []int, val int) int {
	var ptr int
	for i, v := range nums {
		if v == val {
			ptr++
		} else {
			nums[i-ptr] = v 
		}
	}

	return len(nums) - ptr
}
