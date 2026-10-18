package main

func flipAndInvertImage(image [][]int) [][]int {
	for i, row := range image {
		image[i] = inverse(reverse(row))
	}

	return image
}

func reverse(slice []int) []int {
	result := make([]int, len(slice))

	copy(result, slice)

	for i, j := 0, len(result)-1; i <= j; i, j = i+1, j-1 {
		result[i], result[j] = result[j], result[i]
	}

	return result
}

func inverse(slice []int) []int {
	result := make([]int, len(slice))

	copy(result, slice)

	for i, v := range result {
		if v == 1 {
			result[i] = 0
		} else {
			result[i] = 1
		}
	}

	return result
}
