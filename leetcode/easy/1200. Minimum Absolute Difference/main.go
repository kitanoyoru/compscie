package main

import (
	"math"
	"slices"
)

func minimumAbsDifference(arr []int) [][]int {
	slices.Sort(arr)

	minDiff := math.MaxInt
	var result [][]int

	for i := 0; i < len(arr)-1; i++ {
		d := arr[i+1] - arr[i]

		switch {
		case d < minDiff:
			minDiff = d
			result = [][]int{{arr[i], arr[i+1]}}
		case d == minDiff:
			result = append(result, []int{arr[i], arr[i+1]})
		}
	}

	return result
}
