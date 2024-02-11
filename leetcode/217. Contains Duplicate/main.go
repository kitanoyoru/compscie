package main

func containsDuplicate(nums []int) bool {
	set := make(map[int]struct{}, len(nums))
	for _, num := range nums {
		set[num] = struct{}{}
	}

	return len(set) != len(nums)
}
