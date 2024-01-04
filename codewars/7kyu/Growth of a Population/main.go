package kata

func NbYear(p0 int, percent float64, aug int, p int) int {
	result, iter := 0, p0

	for ; iter < p; result++ {
		iter += int((percent/100)*float64(iter)) + aug
	}

	return result
}
