package main

import "sort"

func findContentChildren(g []int, s []int) int {
	if len(s) == 0 {
		return 0
	}

	sort.Ints(g)
	sort.Ints(s)

	maxNum := 0

	cookieIndex := len(s) - 1
	childIndex := len(g) - 1

	for cookieIndex >= 0 && childIndex >= 0 {
		if s[cookieIndex] >= g[childIndex] {
			maxNum++

			cookieIndex--
			childIndex--
		} else {
			childIndex--
		}
	}

	return maxNum
}
