package main

var VOWELS = map[byte]bool{
	'a': true,
	'e': true,
	'i': true,
	'o': true,
	'u': true,
}

func isVowel(letter byte) bool {
	_, in := VOWELS[letter]
	return in
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func maxVowels(s string, k int) int {
	maxCounter, windowCounter := 0, 0

	for i := 0; i < k; i++ {
		if isVowel(s[i]) {
			windowCounter++
		}
	}

	maxCounter = windowCounter

	for i := k; i < len(s); i++ {
		if isVowel(s[i-k]) {
			windowCounter--
		}
		if isVowel(s[i]) {
			windowCounter++
		}

		maxCounter = max(maxCounter, windowCounter)
	}

	return maxCounter
}
