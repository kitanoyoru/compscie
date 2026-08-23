package main

import "sort"

func combinationSum2(candidates []int, target int) [][]int {
	sort.Ints(candidates)

	result := [][]int{}

	var dfs func([]int, int, int)
	dfs = func(step []int, idx int, remainingTarget int) {
		if remainingTarget == 0 {
			result = append(result, copySlice(step))
			return
		}

		for i := idx; i < len(candidates); i++ {
			if i > idx && candidates[i] == candidates[i-1] {
				continue
			}
			if candidates[i] > remainingTarget {
				break
			}
			step = append(step, candidates[i])
			dfs(step, i+1, remainingTarget-candidates[i])
			step = step[:len(step)-1]
		}
	}

	dfs([]int{}, 0, target)

	return result
}

func copySlice(arr []int) []int {
	copiedArr := make([]int, len(arr))
	copy(copiedArr, arr)
	return copiedArr
}
