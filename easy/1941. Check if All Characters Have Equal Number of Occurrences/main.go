// Solved by @kitanyoru

package main

func areOccurrencesEqual(s string) bool {
	hm := make(map[rune]int)
	for _, ch := range s {
		hm[ch]++
	}

	firstFreq := hm[rune(s[0])]

	for _, v := range hm {
		if firstFreq != v {
			return false
		}
	}

	return true
}
