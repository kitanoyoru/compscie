package main

func countGood(nums []int, k int) int64 {
	count := make(map[int]int)
	left, pairCount, result := 0, 0, 0

	for right := range len(nums) {
		pairCount += count[nums[right]]
		count[nums[right]]++

		for pairCount >= k {
			result += len(nums) - right
			count[nums[left]]--
			pairCount -= count[nums[left]]
			left++
		}
	}

	return int64(result)
}
