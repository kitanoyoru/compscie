package kata

import (
	"strings"
	"unicode"
)

func toWeirdCase(str string) string {
	words := strings.Fields(str)
	var result strings.Builder

	for _, word := range words {
		for i, char := range word {
			if i%2 == 0 {
				result.WriteRune(unicode.ToUpper(char))
			} else {
				result.WriteRune(unicode.ToLower(char))
			}
		}
		result.WriteByte(' ')
	}

	return strings.TrimSpace(result.String())
}
