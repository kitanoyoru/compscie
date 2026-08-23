// Solved by @kitanoyoru

package main

import (
	"sort"
	"strings"
)

func frequencySort(s string) string {
	freq := make(map[rune]int)
	for _, ch := range s {
		freq[ch]++
	}

	chars := make([]rune, 0, len(freq))
	for ch := range freq {
		chars = append(chars, ch)
	}

	sort.SliceStable(chars, func(i, j int) bool {
		return freq[chars[i]] > freq[chars[j]]
	})

	var ans strings.Builder
	for _, ch := range chars {
		for i := 0; i < freq[ch]; i++ {
			ans.WriteRune(ch)
		}
	}

	return ans.String()
}
