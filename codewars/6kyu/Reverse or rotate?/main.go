package kata

import (
	"strconv"
	"strings"
)

func Revrot(s string, n int) string {
	if n <= 0 || n > len(s) {
		return ""
	}

	var sb strings.Builder

	for i := 0; i <= len(s)-n; i += n {
		chunk := s[i : i+n]
		sumOfCubes := calculateSumOfCubes(chunk)

		if sumOfCubes%2 == 0 {
			sb.WriteString(reverseString(chunk))
		} else {
			sb.WriteString(rotateLeftString(chunk))
		}
	}

	return sb.String()
}

func calculateSumOfCubes(s string) int {
	sum := 0

	for _, c := range s {
		digit, _ := strconv.Atoi(string(c))
		sum += digit * digit * digit
	}

	return sum
}

func reverseString(s string) string {
	runes := []rune(s)

	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}

	return string(runes)
}

func rotateLeftString(s string) string {
	return s[1:] + string(s[0])
}
