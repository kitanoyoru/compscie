package main

import "unicode"

func detectCapitalUse(word string) bool {
	runes := []rune(word)
	if len(runes) == 0 {
		return true
	}

	capitalCount := 0
	for _, r := range runes {
		if unicode.IsUpper(r) {
			capitalCount++
		}
	}

	return capitalCount == 0 || capitalCount == len(runes) || (capitalCount == 1 && unicode.IsUpper(runes[0]))
}
