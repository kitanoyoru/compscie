package main

import "strings"

func reverseString(s string) string {
	runes := []rune(s)

	length := len(runes)

	for i := 0; i < length/2; i++ {
		runes[i], runes[length-i-1] = runes[length-i-1], runes[i]
	}

	reversedStr := string(runes)

	return reversedStr
}

func reverseWords(s string) string {
	words := strings.Fields(s)

	for i := 0; i < len(words); i++ {
		words[i] = reverseString(words[i])
	}

	return strings.Join(words, " ")

}
