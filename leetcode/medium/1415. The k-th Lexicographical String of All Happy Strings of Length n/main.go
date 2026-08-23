package main

import "math"

func getHappyString(n int, k int) string {
	total := 3 * int(math.Pow(2, float64(n-1)))
	if k > total {
		return ""
	}

	k -= 1
	result := make([]string, 0, total)
	last := ""

	for idx := range n {

	}

}
