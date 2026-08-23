package main

import "math"

func countPalindromicSubsequence(s string) int {
	minExist := make([]int, 26)
	maxExist := make([]int, 26)

	for i := range minExist {
		minExist[i] = math.MaxInt32
		maxExist[i] = math.MinInt32
	}

	for i := 0; i < len(s); i++ {
		charIndex := int(s[i] - 'a')
		minExist[charIndex] = min(minExist[charIndex], i)
		maxExist[charIndex] = max(maxExist[charIndex], i)
	}

	ans := 0

	for i := 0; i < 26; i++ {
		if minExist[i] == math.MaxInt32 || maxExist[i] == math.MinInt32 {
			continue
		}

		uniqueCharsBetween := make(map[byte]struct{})

		for j := minExist[i] + 1; j < maxExist[i]; j++ {
			uniqueCharsBetween[s[j]] = struct{}{}
		}

		ans += len(uniqueCharsBetween)
	}

	return ans
}
