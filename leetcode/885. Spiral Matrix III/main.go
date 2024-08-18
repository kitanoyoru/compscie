package main

func spiralMatrixIII(rows int, cols int, rStart int, cStart int) [][]int {
	res := [][]int{{rStart, cStart}}

	layer := max(rows-rStart, cols-cStart, rStart+1, cStart+1) + 1
	i, j := rStart, cStart

	for m := 1; m < layer; m++ {
		step := 2*m - 1

		// rightward
		di, dj := 0, 1

		for a := 0; a < step; a++ {
			i += di
			j += dj

			if inside(i, j, rows, cols) {
				res = append(res, []int{i, j})
			}
		}

		// downward
		di, dj = 1, 0
		for a := 0; a < step; a++ {
			i += di
			j += dj

			if inside(i, j, rows, cols) {
				res = append(res, []int{i, j})
			}
		}

		// leftward
		di, dj = 0, -1
		step++

		for a := 0; a < step; a++ {
			i += di
			j += dj

			if inside(i, j, rows, cols) {
				res = append(res, []int{i, j})
			}
		}

		// upward
		di, dj = -1, 0
		for a := 0; a < step; a++ {
			i += di
			j += dj

			if inside(i, j, rows, cols) {
				res = append(res, []int{i, j})
			}
		}
	}

	return res
}

func inside(i, j, rows, cols int) bool {
	return (i >= 0) && (i < rows) && (j >= 0) && (j < cols)
}

func max(nums ...int) int {
	a := nums[0]
	for i := 1; i < len(nums); i++ {
		if nums[i] > a {
			a = nums[i]
		}
	}

	return a
}
