package main

import "math"

type cell struct{ x, y int }

func maximalSquare(matrix [][]byte) int {
	rows, cols := len(matrix), len(matrix[0])
	cache := make(map[cell]int)

	var helper func(x, y int) int
	helper = func(x, y int) int {
		if x >= rows || y >= cols {
			return 0
		}
		if _, exists := cache[cell{x, y}]; !exists {
			down, diag, right := helper(x+1, y), helper(x+1, y+1), helper(x, y+1)
			cache[cell{x, y}] = 0
			if matrix[x][y] == '1' {
				cache[cell{x, y}] = 1 + min(down, diag, right)
			}
		}
		return cache[cell{x, y}]
	}

	helper(0, 0)

	result := math.MinInt
	for _, v := range cache {
		dv := pow(v)
		if dv > result {
			result = dv
		}
	}

	return result
}

func pow(value int) int { return value * value }
