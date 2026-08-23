package main

import "fmt"

func findFreq(nums []int) map[int]int {
	freq := make(map[int]int)

	for _, num := range nums {
		freq[num]++
	}

	return freq
}

func createRow(freq map[int]int) []int {
	row := make([]int, 0, len(freq))
	used := make(map[int]bool)

	for key, val := range freq {
		if val != 0 && !used[key] {
			row = append(row, key)
			freq[key]--
			used[key] = true
		}
	}

	return row
}

func findMatrix(nums []int) [][]int {
	freq := findFreq(nums)

	matrix := [][]int{}
	for len(freq) > 0 {
		row := createRow(freq)
		if len(row) == 0 {
			break
		}
		fmt.Println(row, freq)
		matrix = append(matrix, row)
	}

	return matrix
}
