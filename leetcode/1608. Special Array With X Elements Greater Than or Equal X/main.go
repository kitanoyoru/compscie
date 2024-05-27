package main

import "sort"

func specialArray(nums []int) int {
	sort.Ints(nums)

	start, end := 0, len(nums)

	for start <= end {
		mid := start + (end-start)/2
		freq := count(nums, mid)

		if freq == mid {
			return mid
		} else if freq < mid {
			end = mid - 1
		} else {
			start = mid + 1
		}

	}

	return -1
}

func count(nums []int, target int) int {
	counter := 0

	for _, v := range nums {
		if v >= target {
			counter++

		}
	}

	return counter
}
