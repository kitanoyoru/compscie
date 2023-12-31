package main

func maxLengthBetweenEqualCharacters(s string) int {
	maxLength := -1

	for left := 0; left < len(s); left++ {
		for right := left + 1; right < len(s); right++ {
			if s[left] == s[right] {
				maxLength = max(maxLength, right-left-1)
			}
		}
	}

	return maxLength
}
