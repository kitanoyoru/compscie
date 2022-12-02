// Solved by @kitanoyoru

package main

func checkIsVowel(ch rune) bool {
	var vowels = map[rune]bool{
		'a': true,
		'e': true,
		'i': true,
		'o': true,
		'u': true,
		'A': true,
		'E': true,
		'I': true,
		'O': true,
		'U': true,
	}

	return vowels[ch]
}

func halvesAreAlike(s string) bool {
	c1, c2 := 0, 0
	mid := len(s) / 2

	for i := 0; i < mid; i++ {
		if checkIsVowel(rune(s[i])) {
			c1++
		}
	}
	for i := mid; i < len(s); i++ {
		if checkIsVowel(rune(s[i])) {
			c2++
		}
	}

	return c1 == c2
}
