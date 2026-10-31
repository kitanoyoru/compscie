package main

func relativeSortArray(arr1 []int, arr2 []int) []int {
	freq := make(map[int]int)
	for _, v := range arr1 {
		freq[v]++
	}

	result := make([]int, 0, len(arr1))

	for _, v := range arr2 {
		for freq[v] > 0 {
			result = append(result, v)
			freq[v]--
		}
	}

	for v := 0; v <= 1000; v++ {
		for freq[v] > 0 {
			result = append(result, v)
			freq[v]--
		}
	}
	return result
}
