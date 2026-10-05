package main

func commonChars(words []string) []string {
	freq := [26]int{}
	for _, ch := range words[0] {
		freq[ch-'a']++
	}

	for i := 1; i < len(words); i++ {
		wordFreq := [26]int{}
		for _, ch := range words[i] {
			wordFreq[ch-'a']++
		}

		for j := 0; j < 26; j++ {
			if freq[j] > wordFreq[j] {
				freq[j] = wordFreq[j]
			}
		}
	}

	result := make([]string, 0, 26)

	for i := 0; i < 26; i++ {
		for j := 0; j < freq[i]; j++ {
			result = append(result, string(rune('a'+i)))
		}
	}

	return result
}
