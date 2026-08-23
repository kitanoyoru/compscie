package main

func minFlips(a int, b int, c int) int {
	flips := 0

	for a > 0 || b > 0 || c > 0 {
		bit_a, bit_b, bit_c := a&1, b&1, c&1
		if bit_c == 0 {
			flips += bit_a + bit_b
		} else {
			if bit_a == 0 && bit_b == 0 {
				flips += 1
			}
		}

		a, b, c = a>>1, b>>1, c>>1

	}

	return flips
}
