// Solved by @kitanoyoru

package main

import "sort"

func closeStrings(word1 string, word2 string) bool {
	if len(word1) != len(word2) {
		return false
	}

	freq1, freq2 := [26]int{}, [26]int{}

	for i := 0; i < len(word1); i++ {
		freq1[word1[i]-'a']++
	}
	for i := 0; i < len(word2); i++ {
		freq2[word2[i]-'a']++
	}

	for i := 0; i < 26; i++ {
		if freq1[i] == freq2[i] {
			continue
		}
		if freq1[i] == 0 || freq2[i] == 0 {
			return false
		}
	}

	sort.Ints(freq1[:])
	sort.Ints(freq2[:])

	for i := 0; i < 26; i++ {
		if freq1[i] != freq2[i] {
			return false
		}
	}

	return true
}
