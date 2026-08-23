package main

var Vowels = map[rune]struct{}{
	'a': {},
	'e': {},
	'i': {},
	'o': {},
	'u': {},
}

func maxFreqSum(s string) int {
	var (
		vowelsFreq    = make(map[rune]int)
		consonantFreq = make(map[rune]int)

		maxVowel     int
		maxConsonant int
	)

	for _, v := range s {
		if _, isVowel := Vowels[v]; isVowel {
			vowelsFreq[v]++

			if vowelsFreq[v] > maxVowel {
				maxVowel = vowelsFreq[v]
			}
		} else {
			consonantFreq[v]++

			if consonantFreq[v] > maxConsonant {
				maxConsonant = consonantFreq[v]
			}
		}
	}

	return maxVowel + maxConsonant
}
