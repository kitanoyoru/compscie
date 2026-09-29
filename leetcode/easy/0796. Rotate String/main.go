package main

func rotateString(s string, goal string) bool {
	for i := range len(s) {
		if (s[i:] + s[:i]) == goal {
			return true
		}
	}

	return false
}
