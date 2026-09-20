package main

func reverseDegree(s string) int {
	result := 0

	for i := 0; i < len(s); i++ {
		result += (i + 1) * (26 - int(s[i]-97))
	}

	return result
}
