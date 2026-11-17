package main

func shortestToChar(s string, c byte) []int {
	result := make([]int, len(s))

	prev := -len(s)
	for i := range s {
		if s[i] == c {
			prev = i
		}

		result[i] = i - prev
	}

	prev = 2 * len(s)
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == c {
			prev = i
		}
		result[i] = min(result[i], prev-i)
	}

	return result
}
