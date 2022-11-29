// Solved by @kitanoyoru

package main

import "strings"

func decodeMessage(key string, message string) string {
	hm := make(map[rune]int)
	idx := 0

	for _, k := range key {
		_, ok := hm[k]
		if !ok && k != ' ' {
			hm[k] = idx
			idx++
		}
	}

	var ans strings.Builder

	for _, m := range message {
		if m == ' ' {
			ans.WriteRune(' ')
		} else {
			ans.WriteRune(char(hm[m]))
		}
	}

	return ans.String()
}

func char(i int) rune {
	return rune('a' + rune(i))
}
