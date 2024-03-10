package kata

import "math"

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func Zeroes(base, number int) int {
	noz := math.MaxInt

	j := base
	for i := 2; i <= base; i++ {
		if j%i == 0 {
			p := 0
			for j%i == 0 {
				j /= i
				p++
			}

			c := 0

			var z int = number / i
			for z > 0 {
				c += z
				z /= i
			}

			noz = min(noz, c/p)
		}
	}

	return noz
}
