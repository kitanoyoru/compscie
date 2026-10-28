package main

func duplicateZeros(arr []int) {
	n := len(arr)

	zeros := 0
	for _, v := range arr {
		if v == 0 {
			zeros++
		}
	}

	i := n - 1
	j := n - 1 + zeros

	for i < j {
		writeInBounds(arr, j, arr[i], n)
		if arr[i] == 0 {
			j--
			writeInBounds(arr, j, 0, n)
		}

		i--
		j--
	}
}

func writeInBounds(arr []int, idx, val, n int) {
	if idx < n {
		arr[idx] = val
	}
}

