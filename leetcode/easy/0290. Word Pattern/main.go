// Solved by @kitanoyoru

package main

import "strings"

func wordPattern(pattern string, s string) bool {
	wordMap := make(map[string]byte)
	charMap := make(map[byte]string)

	patternLength := len(pattern)

	words := strings.Fields(s)
	wordsLength := len(words)

	if patternLength != wordsLength {
		return false
	}

	for i := 0; i < patternLength; i++ {
		ch := pattern[i]
		word := words[i]

		if val, ok := charMap[ch]; ok {
			if val != word {
				return false
			}
		} else {
			charMap[ch] = word
		}

		if val, ok := wordMap[word]; ok {
			if val != ch {
				return false
			}
		} else {
			wordMap[word] = ch
		}
	}

	return true
}
