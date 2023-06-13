package main

import (
	"sort"
	"unicode"
)

func secondHighest(s string) int {
	hm := make(map[int]bool)

	for _, ch := range s {
		if unicode.IsDigit(ch) {
			hm[int(ch-'0')] = true
		}
	}

	if len(hm) < 2 {
		return -1
	}

	digits := make([]int, 0, len(hm))
	for k := range hm {
		digits = append(digits, k)
	}

	sort.Slice(digits, func(i, j int) bool {
		return digits[i] > digits[j]
	})

	return digits[1]
}
