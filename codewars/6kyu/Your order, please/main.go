package kata

import (
	"strconv"
	"strings"
)

func Order(sentence string) string {
	fields := strings.Fields(sentence)

	sortedFields := make([]string, len(fields))
	for _, f := range fields {
		idx := strings.IndexFunc(f, func(c rune) bool {
			return c >= '1' && c <= '9'
		})

		parsedIdx, _ := strconv.Atoi(string(f[idx]))
		sortedFields[parsedIdx-1] = f
	}

	return strings.Join(sortedFields, " ")
}
