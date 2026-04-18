package main

func mirrorDistance(n int) int {
	return abs(n - reverse(n))
}

func abs(value int) int {
	if value < 0 {
		return -value
	}

	return value
}

func reverse(value int) int {
	var result int
	for value != 0 {
		digit := value % 10
		result = result*10 + digit
		value /= 10
	}

	return result
}
