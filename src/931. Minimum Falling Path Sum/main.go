// Solved by @kitanoyoru

package main

import "math"

func min(arr ...int) int {
	ans := math.MaxInt32
	for _, v := range arr {
		if ans > v {
			ans = v
		}
	}

	return ans

}

func max(arr ...int) int {
	ans := math.MinInt32

	for _, v := range arr {
		if ans < v {
			ans = v
		}
	}

	return ans
}

func minFallingPathSum(matrix [][]int) int {
	rows, cols := len(matrix), len(matrix[0])

	for i := 1; i < rows; i++ {
		for j := 0; j < cols; j++ {
			a := 0
			if j-1 >= 0 {
				a = matrix[i-1][j-1]
			} else {
				a = math.MaxInt32
			}

			b := matrix[i-1][j]

			c := 0
			if j+1 < cols {
				c = matrix[i-1][j+1]
			} else {
				c = math.MaxInt32
			}

			matrix[i][j] += min(a, b, c)
		}
	}

	return min(matrix[rows-1]...)
}
