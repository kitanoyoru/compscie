package main

import "sort"

func successfulPairs(spells []int, potions []int, success int64) []int {
	m, n := len(spells), len(potions)
	pairs := make([]int, 0, m)

	sort.Ints(potions)

	for _, spell := range spells {
		left, right := 0, n-1
		for left <= right {
			mid := left + (right-left)/2
			prod := spell * potions[mid]
			if prod >= int(success) {
				right = mid - 1
			} else {
				left = mid + 1
			}
		}
		pairs = append(pairs, n-left)
	}

	return pairs
}
