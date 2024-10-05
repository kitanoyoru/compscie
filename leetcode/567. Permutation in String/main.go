package main

func checkInclusion(s1 string, s2 string) bool {
	if len(s2) < len(s1) {
		return false
	}

	s1freq := make([]int, 26)
	for i := 0; i < len(s1); i++ {
		s1freq[s1[i]-'a']++
	}

	s2freq := make([]int, 26)
	for i := 0; i < len(s1); i++ {
		s2freq[s2[i]-'a']++
	}

	if equals(s1freq, s2freq) {
		return true
	}

	for i := len(s1); i < len(s2); i++ {
		s2freq[s2[i]-'a']++
		s2freq[s2[i-len(s1)]-'a']--

		if equals(s1freq, s2freq) {
			return true
		}
	}

	return false
}

func equals(freq1, freq2 []int) bool {
	for i := 0; i < 26; i++ {
		if freq1[i] != freq2[i] {
			return false
		}
	}

	return true
}

