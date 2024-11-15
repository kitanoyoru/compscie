package main

import "math"

func findLengthOfShortestSubarray(arr []int) int {
	var (
		prefix = -1
		suffix = len(arr)
	)

	pptr := math.MinInt
	for _, v := range arr {
		if v >= pptr {
			prefix++
			pptr = v
		} else {
			break
		}
	}

	if prefix == len(arr)-1 {
		return 0
	}

	sptr := math.MaxInt
	for i := len(arr) - 1; i >= 0; i-- {
		if arr[i] <= sptr {
			suffix--
			sptr = arr[i]
		} else {
			break
		}
	}

	result := len(arr) - prefix - 1
	result = min(result, suffix)

	i, j := 0, suffix
	for i <= prefix && j < len(arr) {
		if arr[i] <= arr[j] {
			result = min(result, j-i-1)
			i++
		} else {
			j++
		}
	}

	return result
}

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}
