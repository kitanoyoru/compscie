package main

func greatestLetter(s string) string {
	hm := make(map[int]bool)

	for _, ch := range s {
		hm[int(ch)-65] = true
	}

	for i := 57; i > 31; i-- {
		if hm[i] && hm[i-32] {
			return string(rune(i + 33))
		}
	}

	return ""
}
