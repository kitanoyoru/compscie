package main

func diagonalSum(mat [][]int) int {
	result := 0

	n := len(mat)

	for i := 0; i < n; i++ {
		result += mat[i][i]
		if i != n-i-1 {
			result += mat[i][n-i-1]
		}
	}

	return result
}
