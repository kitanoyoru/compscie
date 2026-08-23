import "sort"

// Solved by @kitanoyoru
// https://leetcode.com/problems/top-k-frequent-words/

func topKFrequent(words []string, k int) []string {
	m := make(map[string]int)
	var keys []string

	for _, word := range words {
		if _, ok := m[word]; !ok {
			keys = append(keys, word)
		}
		m[word]++
	}

	sort.SliceStable(keys, func(i, j int) bool {
		if m[keys[i]] == m[keys[j]] {
			return keys[i] < keys[j]
		} else {
			return m[keys[i]] > m[keys[j]]
		}
	})

	return keys[:k]
}
