package main

import "math"

func findSpecialInteger(arr []int) int {
	if len(arr) < 3 {
		return arr[0]
	}

	quater := int(math.Floor(float64(len(arr)) * float64(0.25)))

	hm := make(map[int]int)

	for _, num := range arr {
		hm[num]++
	}

	for num, freq := range hm {
		if freq > quater {
			return num
		}
	}

	return 0
}
