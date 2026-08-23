package main

func abs(a int) int {
	if a < 0 {
		return -a
	}

	return a
}

func findDuplicates(nums []int) []int {
	ans := []int{}

	for _, num := range nums {
		pos := abs(num)
		if nums[pos-1] < 0 {
			ans = append(ans, pos)
		}
		nums[pos-1] = -1 * nums[pos-1]
	}

	return ans
}
