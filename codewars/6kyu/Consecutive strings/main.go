package kata

import (
	"strings"
)

func LongestConsec(strarr []string, k int) string {
	n := len(strarr)

	if n == 0 || k > n || k <= 0 {
		return ""
	}

	var (
		buffer string
		result string
	)

	for i := 0; i+k-1 < n; i++ {
		buffer = strings.Join(strarr[i : i+k][:], "")
		if len(buffer) > len(result) {
			result = buffer
		}
	}

	return result
}
