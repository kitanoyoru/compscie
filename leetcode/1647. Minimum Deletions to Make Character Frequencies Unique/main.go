package main

import "sort"

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func findSortedFreq(s string) []int {
	freq := make([]int, 26)
	for i := 0; i < len(s); i++ {
		freq[s[i]-'a']++
	}

	sort.Ints(freq)

	return freq
}

func minDeletions(s string) int {
	f := findSortedFreq(s)

	del := 0
	for i := 24; i >= 0; i-- {
		if f[i] == 0 {
			break
		}

		if f[i] >= f[i+1] {
			prev := f[i]
			f[i] = max(0, f[i+1]-1)
			del += prev - f[i]
		}
	}

	return del
}
