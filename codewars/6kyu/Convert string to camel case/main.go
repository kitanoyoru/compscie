package kata

import "strings"

func ToCamelCase(s string) string {
	fields := strings.FieldsFunc(s, func(c rune) bool {
		return c == '-' || c == '_'
	})

	for i := 1; i < len(fields); i++ {
		fields[i] = capitalize(fields[i])
	}

	return strings.Join(fields, "")
}

func capitalize(input string) string {
	return strings.ToUpper(string(input[0])) + input[1:]
}
