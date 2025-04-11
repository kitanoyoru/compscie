package main

func countSymmetricIntegers(low int, high int) int {
	var result int

	for number := low; number <= high; number++ {
		digits := getDigits(number)
		if len(digits)%2 == 1 {
			continue
		}

		if isSymmetric(digits) {
			result++
		}
	}

	return result
}

func getDigits(number int) []int {
	var digits []int
	for number > 0 {
		digits = append(digits, number%10)
		number /= 10
	}

	for i, j := 0, len(digits)-1; i < j; i, j = i+1, j-1 {
		digits[i], digits[j] = digits[j], digits[i]
	}

	return digits
}

func isSymmetric(digits []int) bool {
	n := len(digits) / 2

	var sum1, sum2 int
	for i := range n {
		sum1 += digits[i]
		sum2 += digits[i+n]
	}

	return sum1 == sum2
}
