package main

func missingNumber(nums []int) int {
	set := make(map[int]struct{}, len(nums))

	for _, num := range nums {
		set[num] = struct{}{}
	}

	for num := range len(nums)+1 {
		if _, exists := set[num]; !exists {
			return num 
		} 
	}

	return -1
}

