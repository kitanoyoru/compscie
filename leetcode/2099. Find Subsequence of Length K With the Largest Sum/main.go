package main

import "sort"

type pair struct {
	value, idx int
}

func maxSubsequence(nums []int, k int) []int {
	n := len(nums)
	pairs := make([]pair, n)
	for i, v := range nums {
		pairs[i] = pair{v, i}
	}

	sort.Slice(pairs, func(i, j int) bool {
		return pairs[i].value > pairs[j].value
	})

	neededPairs := pairs[0:k]

	sort.Slice(neededPairs, func(i, j int) bool {
		return neededPairs[i].idx < neededPairs[j].idx
	})

	result := make([]int, len(neededPairs))
	for i, pair := range neededPairs {
		result[i] = pair.value
	}

	return result
}
