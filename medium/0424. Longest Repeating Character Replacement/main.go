package main

func characterReplacement(s string, k int) int {
	result := 0

	left, maxCount := 0, 0
	window := [26]int{}

	for right := 0; right < len(s); right++ {
		window[s[right]-'A']++

		maxCount = max(maxCount, window[s[right]-'A'])

		if right-left+1 > maxCount+k {
			window[s[left]-'A']--
			left++
		}

		result = max(result, right-left+1)
	}

	return result
}
