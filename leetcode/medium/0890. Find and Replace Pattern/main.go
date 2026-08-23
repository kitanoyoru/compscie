// Solved by @kitanoyoru

package main

func getFreq(word string) [26]int {
	freq, m := [26]int{}, make(map[rune]int)

	for i, ch := range word {
		if _, ok := m[ch]; !ok {
			m[ch] = len(m)
		}
		freq[i] = m[ch]
	}

	return freq
}

func findAndReplacePattern(words []string, pattern string) []string {
	ans := make([]string, 0, len(words))

	patternVal := getFreq(pattern)

	for _, word := range words {
		wordVal := getFreq(word)
		if wordVal == patternVal {
			ans = append(ans, word)
		}
	}

	return ans
}
