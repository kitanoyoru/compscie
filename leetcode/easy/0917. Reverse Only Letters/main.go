package main

func reverseOnlyLetters(s string) string {
	bytes := []byte(s)
	left, right := 0, len(bytes)-1

	isLetter := func(b byte) bool {
		return (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z')
	}

	for left <= right {
		switch {
		case !isLetter(bytes[left]):
			left++
		case !isLetter(bytes[right]):
			right--
		default:
			bytes[left], bytes[right] = bytes[right], bytes[left]
			left++
			right--
		}
	}

	return string(bytes)
}
