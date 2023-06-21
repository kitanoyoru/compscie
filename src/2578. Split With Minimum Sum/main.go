package main

import "sort"

func getNumDigits(num int) []int {
	digits := []int{}

	for num != 0 {
		digits = append(digits, num%10)
		num /= 10
	}

	return digits
}

func splitNum(num int) int {
	digits := getNumDigits(num)

	sort.Ints(digits)

	n := len(digits)
	num1, num2 := 0, 0

	for i := 0; i < n; i += 2 {
		num1 = num1*10 + digits[i]
	}
	for i := 1; i < n; i += 2 {
		num2 = num2*10 + digits[i]
	}

	return num1 + num2
}
