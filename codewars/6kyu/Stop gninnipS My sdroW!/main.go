package kata

import "strings"

func SpinWords(str string) string {
	fields := strings.Fields(str)

	newFields := make([]string, len(fields))
	for i, v := range fields {
		newStr := v
		if len(v) >= 5 {
			newStr = reverse(v)
		}

		newFields[i] = newStr
	}

	return strings.Join(newFields, " ")
}

func reverse(s string) string {
	runes := []rune(s)

	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}

	return string(runes)
}
