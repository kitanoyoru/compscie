// Solved by @kitanoyoru
// https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/

package main

import "strings"

func concArrOfString(a []string) string {
	var b string
	for _, v := range a {
		b += v
	}

	return b
}

func arrayStringsAreEqual(word1 []string, word2 []string) bool {
	a := concArrOfString(word1)
	b := concArrOfString(word2)

	return strings.EqualFold(a, b)
}
