package kata

func min(a, b uint) uint {
	if a < b {
		return a
	}

	return b
}

func Hammer(n int) uint {
	h := make([]uint, n)
	h[0] = 1

	var (
		nextTwo   uint = 2
		nextThree uint = 3
		nextFive  uint = 5
	)

	i, j, k := 0, 0, 0
	for m := 1; m < len(h); m++ {
		h[m] = min(nextTwo, min(nextThree, nextFive))
		if h[m] == nextTwo {
			i++
			nextTwo = 2 * h[i]
		}
		if h[m] == nextThree {
			j++
			nextThree = 3 * h[j]
		}
		if h[m] == nextFive {
			k++
			nextFive = 5 * h[k]
		}
	}

	return h[n-1]
}
