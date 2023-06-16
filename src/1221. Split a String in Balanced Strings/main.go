package main

func balancedStringSplit(s string) int {
	L, R := 0, 0

	substrCounter := 0

	for _, ch := range s {
		if ch == 'L' {
			L++
		} else {
			R++
		}

		if L == R {
			substrCounter++
		}
	}

	return substrCounter
}
