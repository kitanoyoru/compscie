package main

func findDisappearedNumbers(nums []int) []int {
	set := make(map[int]struct{}, len(nums))
	for _, num := range nums {
		set[num] = struct{}{}
	}

	result := make([]int, 0, len(nums))

	for num := 1; num <= len(nums); num++ {
		if _, exists := set[num]; !exists {
			result = append(result, num)
		}
	}

	return result
}
