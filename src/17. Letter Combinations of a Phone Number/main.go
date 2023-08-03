package main

func letterCombinations(digits string) []string {
	res := []string{}

	if len(digits) == 0 {
		return res
	}

	n := len(digits)
	dict := map[byte]string{
		'2': "abc",
		'3': "def",
		'4': "ghi",
		'5': "jkl",
		'6': "mno",
		'7': "psqrs",
		'8': "tuv",
		'9': "wxyz",
	}

	var dfs func([]rune, int)
	dfs = func(path []rune, idx int) {
		if len(path) == n {
			res = append(res, string(path))
			return
		}

		chars := dict[digits[idx]]
		for _, ch := range chars {
			path = append(path, ch)
			dfs(path, idx+1)
			path = path[:len(path)-1]
		}
	}

	dfs([]rune{}, 0)

	return res
}
