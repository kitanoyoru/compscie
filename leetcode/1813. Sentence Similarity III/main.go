package main

import "strings"

func areSentencesSimilar(sentence1 string, sentence2 string) bool {
	words1, words2 := strings.Fields(sentence1), strings.Fields(sentence2)

	if len(words1) == 0 && len(words2) == 0 {
		return true
	}

	if len(words1) > len(words2) {
		words1, words2 = words2, words1
	}

	prefixLen := 0
	for prefixLen < len(words1) && prefixLen < len(words2) && words1[prefixLen] == words2[prefixLen] {
		prefixLen++
	}

	suffixLen := 0
	for suffixLen < len(words1) && suffixLen < len(words2) && words1[len(words1)-1-suffixLen] == words2[len(words2)-1-suffixLen] {
		suffixLen++
	}

	return prefixLen+suffixLen >= len(words1)
}

