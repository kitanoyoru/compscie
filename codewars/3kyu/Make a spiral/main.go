package kata

func Spiralize(size int) [][]int {
	if size == 2 {
		return [][]int{{1, 1}, {0, 1}}
	}
	if size == 3 {
		return [][]int{{1, 1, 1}, {0, 0, 1}, {1, 1, 1}}
	}

	base := Spiralize(size - 2)
	res := make([][]int, 2)
	res[0] = make([]int, size)
	res[1] = make([]int, size)

	for i := 0; i < size; i++ {
		res[0][i] = 1
		res[1][i] = 0
	}
	res[1][size-1] = 1

	for i := size - 3; i >= 0; i-- {
		newRow := reverse(base[i])
		newRow = append(newRow, 0, 1)
		res = append(res, newRow)
	}

	res[size-1][size-2] = 1

	return res
}

func reverse(s []int) []int {
	a := make([]int, len(s))
	copy(a, s)

	for i := len(a)/2 - 1; i >= 0; i-- {
		opp := len(a) - 1 - i
		a[i], a[opp] = a[opp], a[i]
	}

	return a
}
