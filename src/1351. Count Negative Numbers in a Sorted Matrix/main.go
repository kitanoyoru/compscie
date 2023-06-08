package main

import "math"

func binSearchNegative(arr []int) int {
	left, right, prev, idx := 0, len(arr)-1, math.MaxInt, -1

	for left <= right {
		mid := left + (right-left)/2
		if arr[mid] >= 0 {
			left = mid + 1
			if arr[mid] <= prev {
				prev = arr[mid]
				idx = mid
			}
		} else {
			right = mid - 1
		}
	}

	if idx == -1 {
		return len(arr)
	}

	return len(arr) - (idx + 1)
}

func countNegatives(grid [][]int) int {
	nums := 0
	for _, row := range grid {
		nums += binSearchNegative(row)
	}

	return nums
}
