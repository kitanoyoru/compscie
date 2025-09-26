package main

import (
	"math"
)

func findRestaurant(list1 []string, list2 []string) []string {
	commonStrings := make(map[string][]int)

	for i := range len(list1) {
		for j := range len(list2) {
			if list1[i] == list2[j] {
				commonStrings[list1[i]] = []int{i, j}
			}
		}
	}

	var result []string

	minIndexSum := math.MaxInt
	changed := false

	for str, idxs := range commonStrings {
		minIndexSum, changed = min(minIndexSum, idxs[0]+idxs[1])

		if changed {
			result = []string{str}
		} else if minIndexSum == idxs[0]+idxs[1] {
			result = append(result, str)
		}
	}

	return result
}

func min(first, second int) (int, bool) {
	if first <= second {
		return first, false
	}

	return second, true
}

