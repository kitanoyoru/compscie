package main

func initFreqMap(s string) map[byte]int {
	m := make(map[byte]int)
	for i := 0; i < len(s); i++ {
		m[s[i]]++
	}

	return m
}

func areSame(s, p map[byte]int) bool {
	for k, v := range s {
		if p[k] != v {
			return false
		}
	}

	return true
}

func findAnagrams(s string, p string) []int {
	arr := []int{}

	pl, sl := len(p), len(s)

	if sl < pl {
		return []int{}
	}

	pFreq := initFreqMap(p)
	sFreq := initFreqMap(s[:pl])

	if areSame(pFreq, sFreq) {
		arr = append(arr, 0)
	}

	for i := pl; i < sl; i++ {
		sFreq[s[i]]++
		sFreq[s[i-pl]]--
		if areSame(sFreq, pFreq) {
			arr = append(arr, i-pl+1)
		}
	}

	return arr
}
