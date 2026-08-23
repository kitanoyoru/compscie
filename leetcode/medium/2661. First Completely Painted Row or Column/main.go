package main

import "math"

func firstCompleteIndex(arr []int, mat [][]int) int {
	numToIdx := make(map[int]int, len(arr))
	for i, v := range arr {
		numToIdx[v] = i
	}

	var (
		result int = math.MaxInt
		rows   int = len(mat)
		cols   int = len(mat[0])
	)

	for row := 0; row < rows; row++ {
		lastElementIdx := math.MinInt

		for col := 0; col < cols; col++ {
			idxVal := numToIdx[mat[row][col]]
			lastElementIdx = max(lastElementIdx, idxVal)
		}

		result = min(result, lastElementIdx)
	}

	for col := 0; col < cols; col++ {
		lastElementIdx := math.MinInt

		for row := 0; row < rows; row++ {
			idxVal := numToIdx[mat[row][col]]
			lastElementIdx = max(lastElementIdx, idxVal)
		}

		result = min(result, lastElementIdx)
	}

	return result
}

func max(a, b int) int {
	if a < b {
		return b
	}

	return a
}

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}
