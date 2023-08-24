// Solved by @kitanoyoru

package main

import "sort"

func sortPeople(names []string, heights []int) []string {
	hm := make(map[int]string)
	for i := 0; i < len(heights); i++ {
		hm[heights[i]] = names[i]
	}

	keys := make([]int, 0, len(heights))
	for k, _ := range hm {
		keys = append(keys, k)
	}

	sort.SliceStable(keys, func(i, j int) bool {
		return keys[i] > keys[j]
	})

	ans := make([]string, 0, len(names))
	for _, k := range keys {
		ans = append(ans, hm[k])
	}

	return ans
}
