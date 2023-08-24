// Solved by @kitanoyoru

package main

import (
	"strings"
)

func sortString(s string) string {
	hm := make([]int, 26)
	for _, ch := range s {
		hm[ch-97]++
	}

	var buf strings.Builder
	i, dir := 0, 1

	for buf.Len() < len(s) {
		if i == 26 {
			i = 25
			dir = -1
		}

		if i == -1 {
			i = 0
			dir = 1
		}

		if hm[i] > 0 {
			buf.WriteByte(byte(i + 97))
			hm[i]--
		}

		i += dir
	}

	return buf.String()
}
