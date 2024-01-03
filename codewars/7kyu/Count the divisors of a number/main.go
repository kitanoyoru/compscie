package kata

func Divisors(n int) int {
	result := 0

	for i := 1; i <= n/2; i++ {
		if n%i == 0 {
			result++
		}
	}

	return result
}
