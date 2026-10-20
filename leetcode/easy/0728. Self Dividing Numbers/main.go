package main

import "strconv"

func selfDividingNumbers(left int, right int) []int {
	result := make([]int, 0, right)

	for number := left; number <= right; number++ {
		if ok := isSelfDividing(number); ok {
			result = append(result, number)
		}
	}

	return result
}

func isSelfDividing(number int) bool {
	var (
		s      = strconv.Itoa(number)
		digits = make([]int, len(s))
	)

	for i, c := range s {
		if c == '0' {
			return false
		}

		digits[i] = int(c - '0')
	}

	for _, digit := range digits {
		if number%digit != 0 {
			return false
		}
	}

	return true
}
