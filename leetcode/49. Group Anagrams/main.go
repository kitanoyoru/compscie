package main

import "sort"

func sortString(str string) string {
	runes := []rune(str)

	sort.Slice(runes, func(i, j int) bool {
		return runes[i] < runes[j]
	})

	return string(runes)
}

func groupAnagrams(strs []string) [][]string {
	if len(strs) == 0 {
		return [][]string{}
	}

	m := make(map[string][]string, len(strs))

	for _, s := range strs {
		key := sortString(s)

		if _, has := m[key]; has {
			m[key] = append(m[key], s)
		} else {
			m[key] = []string{s}
		}
	}

	values := make([][]string, 0, len(m))
	for _, val := range m {
		values = append(values, val)
	}

	return values
}
