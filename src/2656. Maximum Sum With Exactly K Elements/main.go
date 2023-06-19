package main

func getMaxElement(nums []int) int {
	max := nums[0]

	for _, num := range nums {
		if num > max {
			max = num
		}
	}

	return max
}

func maximizeSum(nums []int, k int) int {
	max := getMaxElement(nums)
	return max*k + k*(k-1)/2
}
