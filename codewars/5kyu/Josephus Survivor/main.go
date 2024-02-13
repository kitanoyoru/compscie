package kata

func JosephusSurvivor(n, k int) int {
	numbers := make([]int, n)
	for i := 0; i < n; i++ {
		numbers[i] = i + 1
	}

	idx := 0
	for len(numbers) != 1 {
		idx = (idx + k - 1) % len(numbers)
		numbers = append(numbers[:idx], numbers[idx+1:]...)
	}

	return numbers[0]
}
