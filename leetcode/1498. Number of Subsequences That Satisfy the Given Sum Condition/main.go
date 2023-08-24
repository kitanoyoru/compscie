package main

import (
	"math"
	"sort"
)

func numSubseq(nums []int, target int) int {
	sort.Ints(nums)

	n := len(nums)

	counter := 0
	mod := int(math.Pow10(8)) + 7
	left, right := 0, n-1

	pows := make([]int, n)
	pows[0] = 1
	for i := 1; i < n; i++ {
		pows[i] = pows[i-1] * 2 % mod
	}

	for left <= right {
		if nums[left]+nums[right] > target {
			right--
		} else {
			counter += pows[right-left] % mod
			left++
		}
	}

	return counter
}
