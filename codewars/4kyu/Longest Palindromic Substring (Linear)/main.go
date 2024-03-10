package kata

type substring struct {
	leftIdx  int
	rightIdx int
}

func (ss substring) len() int {
	return ss.rightIdx - ss.leftIdx
}

func LongestPalindrome(s string) string {
	if len(s) == 0 {
		return ""
	}

	result := substring{0, 1}

	for i := 1; i < len(s); i++ {
		odd, even := getLongestPalindrome(s, i-1, i+1), getLongestPalindrome(s, i-1, i)

		var potentialLongestPalindrome substring
		if even.len() > odd.len() {
			potentialLongestPalindrome = even
		} else {
			potentialLongestPalindrome = odd
		}

		if potentialLongestPalindrome.len() > result.len() {
			result = potentialLongestPalindrome
		}
	}

	return s[result.leftIdx:result.rightIdx]
}

func getLongestPalindrome(s string, leftIdx, rightIdx int) substring {
	for leftIdx >= 0 && rightIdx < len(s) {
		if s[leftIdx] != s[rightIdx] {
			break
		}

		leftIdx -= 1
		rightIdx += 1
	}

	return substring{leftIdx + 1, rightIdx}
}
