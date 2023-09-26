package main

func removeDuplicateLetters(s string) string {
	stack := []rune{}
	seen := make(map[rune]bool)

	lastOcc := make(map[rune]int)
	for i, c := range s {
		lastOcc[c] = i
	}

	for i, c := range s {
		if !seen[c] {
			for len(stack) > 0 && c < stack[len(stack)-1] && i < lastOcc[stack[len(stack)-1]] {
				delete(seen, stack[len(stack)-1])
				stack = stack[:len(stack)-1]
			}
			seen[c] = true
			stack = append(stack, c)
		}
	}

	return string(stack)
}
