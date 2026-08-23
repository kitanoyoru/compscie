package main

import (
	"strings"
)

func uncommonFromSentences(s1 string, s2 string) []string {
	s1map := make(map[string]int)
	for _, v := range strings.Split(s1, " ") {
		s1map[v]++
	}

	s2map := make(map[string]int)
	for _, v := range strings.Split(s2, " ") {
		s2map[v]++
	}

	var result []string

	for word, freq := range s1map {
		if _, exists := s2map[word]; !exists && freq == 1 {
			result = append(result, word)
		}
	}
	for word, freq := range s2map {
		if _, exists := s1map[word]; !exists && freq == 1 {
			result = append(result, word)
		}
	}

	return result
}
