package main

const M = 1_000_000_007

func countGoodNumbers(n int64) int {
	var (
		evenPositions = (n + 1) / 2
		oddPositions  = n / 2
	)

	evenPow := binpow(5, evenPositions)
	oddPow := binpow(4, oddPositions)

	return int(evenPow * oddPow % M)
}

func binpow(number, power int64) int64 {
	number %= M
	result := int64(1)

	for power > 0 {
		if (power & 1) == 1 {
			result = result * number % M
		}
		number = number * number % M
		power >>= 1
	}

	return result
}
