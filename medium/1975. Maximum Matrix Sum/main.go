package main

import "math"

func maxMatrixSum(matrix [][]int) int64 {
	var (
		minAbsValue         = math.MaxInt64
		totalNegativeValues = 0
		sumAbsValues        = 0
	)

	for _, row := range matrix {
		for _, value := range row {
			if value < 0 {
				totalNegativeValues++
			}

			absValue := abs(value)
			minAbsValue = min(minAbsValue, absValue)
			sumAbsValues += absValue
		}
	}

	if totalNegativeValues%2 == 0 {
		return int64(sumAbsValues)
	}

	return int64(sumAbsValues) - int64(minAbsValue) 

}

func abs(value int) int {
	if value < 0 {
		return -value
	}

	return value
}
