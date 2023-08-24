package main

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func isAlienSorted(words []string, order string) bool {
	if len(words) == 0 {
		return true
	}

	m := make(map[byte]int)
	for i := range order {
		m[order[i]] = i
	}

	var compare func(int, int) bool
	compare = func(i, j int) bool {
		s1, s2 := words[i], words[j]
		n := min(len(s1), len(s2))
		for k := 0; k < n; k++ {
			if s1[k] != s2[k] {
				if m[s1[k]] < m[s2[k]] {
					return true
				} else {
					return false
				}
			}
		}

		return len(s1) <= len(s2)
	}

	for i := 1; i < len(words); i++ {
		if !compare(i-1, i) {
			return false
		}
	}

	return true
}
