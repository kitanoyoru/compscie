package kata

func FindSummands(n int) []int {
	ans := make([]int, 0, n)

	num := (n * n) - (n - 1)
	for n > 0 {
		ans = append(ans, num)
		num += 2
		n--
	}

	return ans
}
