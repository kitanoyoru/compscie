// Solved by @Kitanoyoru

package main

import "sort"

func mergeSimilarItems(items1 [][]int, items2 [][]int) (ans [][]int) {
	hm := make(map[int]int)

	for _, item := range items1 {
		hm[item[0]] += item[1]
	}
	for _, item := range items2 {
		hm[item[0]] += item[1]
	}

	for k, v := range hm {
		ans = append(ans, []int{k, v})
	}

	sort.Slice(ans, func(i, j int) bool {
		return ans[i][1] < ans[j][1]
	})

	return
}
