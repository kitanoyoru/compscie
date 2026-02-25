package main

import (
	"sort"
)

func sortByBits(arr []int) []int {
	sort.Slice(arr, func(i, j int) bool {
		bitsI, bitsJ := countOfSetBits(arr[i]), countOfSetBits(arr[j])

		if bitsI == bitsJ {
			return arr[i] < arr[j]
		}

		return bitsI < bitsJ
	})

	return arr
}

func countOfSetBits(number int) int {
	var result int
	for number != 0 {
		result += number & 1
		number >>= 1
	}

	return result
}
