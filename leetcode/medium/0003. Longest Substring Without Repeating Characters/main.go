package main

func lengthOfLongestSubstring(s string) int {
	var result int

	var i, j int

	for ; i < len(s); i++ {
		t := 1
		j = i + 1

		m := make(map[byte]struct{})
		m[s[i]] = struct{}{}

		for ; j < len(s); j++ {
			if _, ok := m[s[j]]; ok {
				break
			}

			m[s[j]] = struct{}{}

			t++
		}

		result = max(result, t)
	}

	return result
}

