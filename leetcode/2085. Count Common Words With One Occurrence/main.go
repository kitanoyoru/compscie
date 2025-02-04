package main

func countWords(words1 []string, words2 []string) int {
	m1, m2 := make(map[string]int), make(map[string]int)
	for _, word := range words1 {
		m1[word]++
	}
	for _, word := range words2 {
		m2[word]++
	}

	var result int
	for v, f1 := range m1 {
		if f1 == 1 {
			if f2, ok := m2[v]; ok {
				if f2 == 1 {
					result++
				}
			}
		}
	}

	return result
}
