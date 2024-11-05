package main

// 10
// 1001 -> 10 | 01
// 100101 -> 10 | 01 | 01

func minChanges(s string) int {
	result := 0

	for i := 0; i <= len(s)-2; i += 2 {
		substr := s[i : i+2]

		if substr == "01" || substr == "10" {
			result++
		}
	}

	return result
}
