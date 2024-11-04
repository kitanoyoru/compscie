package main

import (
	"fmt"
	"strings"
)

func compressedString(word string) string {
	var result strings.Builder

	i := 0
	for i < len(word) {
		char, counter := word[i], 0

		for i < len(word) && word[i] == char && counter < 9 {
			counter++
			i++
		}

		result.WriteString(fmt.Sprintf("%d%c", counter, char))
	}

	return result.String()
}

