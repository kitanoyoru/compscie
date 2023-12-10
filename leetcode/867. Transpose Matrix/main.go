package main

func transpose(matrix [][]int) [][]int {
	newMatrix := make([][]int, len(matrix[0]))

	for _, row := range matrix {
		for i := 0; i < len(row); i++ {
			newMatrix[i] = append(newMatrix[i], row[i])
		}
	}

	return newMatrix
}
