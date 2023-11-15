package main

import "sort"

func maximumElementAfterDecrementingAndRearranging(arr []int) int {
	sort.Ints(arr)

	arr[0] = 1

	for i := 1; i < len(arr); i++ {
		if abs(arr[i]-arr[i-1]) <= 1 {
			continue
		} else {
			arr[i] = arr[i-1] + 1
		}
	}

	return arr[len(arr)-1]
}

func abs(x int) int {
	if x < 0 {
		return -x
	}

	return x
}
