package main

import "sort"

func removeAnagrams(words []string) []string {
	if len(words) == 0 {
		return nil
	}

	result := []string{words[0]}
	prevKey := sortedString(words[0])

	for i := 1; i < len(words); i++ {
		currKey := sortedString(words[i])
		if currKey != prevKey {
			result = append(result, words[i])
		}
		prevKey = currKey
	}

	return result
}

func sortedString(s string) string {
	r := []rune(s)
	sort.Slice(r, func(i, j int) bool { return r[i] < r[j] })
	return string(r)
}
