package main

var Romans = map[byte]int{
	'I': 1,
	'V': 5,
	'X': 10,
	'L': 50,
	'C': 100,
	'D': 500,
	'M': 1000,
}

func romanToInt(s string) int {
	var result int

	for i := 0; i < len(s); i++ {
		if i > 0 && Romans[s[i]] > Romans[s[i-1]] {
			result += Romans[s[i]] - 2*Romans[s[i-1]]
		} else {
			result += Romans[s[i]]

		}
	}

	return result
}
