package main

import "math"

func countHomogenous(s string) int {
	if len(s) == 0 {
		return 0
	}

	counter := 0
	appear := 1

	for i := 1; i < len(s); i++ {
		if s[i] == s[i-1] {
			appear++
		} else {
			counter += (appear * (appear + 1)) / 2
			appear = 1
		}
	}

	counter += (appear * (appear + 1)) / 2

	return counter % int(math.Pow10(9)+7)
}
