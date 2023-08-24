package main

import "math/rand"

func quicksort(arr []int) []int {
	if len(arr) < 2 {
		return arr
	}

	start, end := 0, len(arr)-1

	pivot := rand.Int() % len(arr)

	arr[pivot], arr[end] = arr[end], arr[pivot]

	for i := 0; i < len(arr); i++ {
		if arr[i] < arr[end] {
			arr[start], arr[i] = arr[i], arr[start]
			start++
		}
	}

	arr[start], arr[end] = arr[end], arr[start]

	quicksort(arr[:start])
	quicksort(arr[start+1:])

	return arr

}

func sortArray(nums []int) []int {
	return quicksort(nums)
}
