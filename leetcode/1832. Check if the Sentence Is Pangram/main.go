// Solved by @kitanoyoru
// https://leetcode.com/problems/check-if-the-sentence-is-pangram/

import "strings"

func checkIfPangram(sentence string) bool {
	return strings.TrimLeft("abcdefghijklmnopqrstuvwxyz", sentence) == ""
}
