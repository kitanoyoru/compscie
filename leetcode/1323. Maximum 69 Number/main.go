package main

import (
	"strconv"
	"strings"
)

func maximum69Number(num int) int {
	strNum := strconv.Itoa(num)

	sb := strings.Builder{}

	changed := false
	for _, digit := range strNum {
		if digit == '6' && !changed {
			sb.WriteRune('9')
			changed = true
		} else {
			sb.WriteRune(digit)
		}
	}

	num, _ = strconv.Atoi(sb.String())

	return num
}
