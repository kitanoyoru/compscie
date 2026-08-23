package main

var digitToLetters = map[string]string{
	"2": "abc",
	"3": "def",
	"4": "ghi",
	"5": "jkl",
	"6": "mno",
	"7": "pqrs",
	"8": "tuv",
	"9": "wxyz",
}

func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}

	var result []string

	digitPos := make([]string, len(digits))
	for i, digit := range digits {
		digitPos[i] = string(digit)
	}

	var backtrack func(s string, idx int)
	backtrack = func(s string, idx int) {
		if len(s) == len(digits) {
			result = append(result, s)
			return
		}

		for _, letter := range digitToLetters[digitPos[idx]] {
			backtrack(s+string(letter), idx+1)
		}
	}

	backtrack("", 0)

	return result
}

