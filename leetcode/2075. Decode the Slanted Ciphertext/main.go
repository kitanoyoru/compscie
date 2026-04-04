package main

import "strings"

func decodeCiphertext(encodedText string, rows int) string {
	if rows == 0 {
		return ""
	}

	var (
		n    = len(encodedText)
		cols = n / rows
		sb   strings.Builder
	)

	for idx := range cols {
		r, c := 0, idx

		for r < rows && c < cols {
			sb.WriteByte(encodedText[r*cols+c])

			r += 1
			c += 1
		}
	}

	result := strings.TrimRight(sb.String(), " ")

	return result
}
