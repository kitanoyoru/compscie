package kata

func PositiveSum(numbers []int) int {
	var counter int
	for _, v := range numbers {
		if v > 0 {
			counter += v
		}
	}

	return counter
}
