package main

func checkDivisibility(n int) bool {
	digitSum, digitProduct := 0, 1

	x := n
	for x > 0 {
		digit := x % 10
		digitSum += digit
		digitProduct *= digit
		x /= 10
	}

	return n % (digitSum + digitProduct) == 0
}
