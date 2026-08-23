package main

import "strings"

func findWords(words []string) []string {
	letters := make(map[rune]int)

	keyboard := []struct {
		row string
		idx int
	}{
		{"qwertyuiop", 1},
		{"asdfghjkl", 2},
		{"zxcvbnm", 3},
	}

	for _, entry := range keyboard {
		for _, ch := range entry.row {
			letters[ch] = entry.idx
		}
	}

	result := make([]string, 0, len(words))

	for _, word := range words {
		if len(word) == 0 {
			continue
		}

		lower := strings.ToLower(word)
		row, canBeTyped := letters[rune(lower[0])], true

		for _, v := range lower {
			if letters[v] != row {
				canBeTyped = false
				break
			}
		}

		if canBeTyped {
			result = append(result, word)
		}
	}

	return result
}

