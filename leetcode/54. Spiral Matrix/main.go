package main

func spiralOrder(matrix [][]int) []int {
	if len(matrix) == 0 {
		return []int{}
	}

	rows, cols := len(matrix), len(matrix[0])
	left, right, top, bottom := 0, cols-1, 0, rows-1

	result := []int{}

	for len(result) != rows*cols {
		for i := left; i < right+1; i++ {
			result = append(result, matrix[top][i])
		}
		top++

		for i := top; i < bottom+1; i++ {
			result = append(result, matrix[i][right])
		}
		right--

		if top <= bottom {
			for i := right; i > left-1; i-- {
				result = append(result, matrix[bottom][i])
			}
			bottom--
		}

		if left <= right {
			for i := bottom; i > top-1; i-- {
				result = append(result, matrix[i][left])
			}
			left++
		}

	}

	return result
}
