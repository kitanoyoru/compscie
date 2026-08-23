package main

func smallestSubsequence(s string) string {
	lastOccurence := make([]int, 26)
	for i := range len(s) {
		lastOccurence[s[i]-'a'] = i
	}

	seen := make([]bool, 26)
	stack := []byte{}

	for i := range len(s) {
		c := s[i]
		idx := c - 'a'

		if seen[idx] {
			continue
		}

		for len(stack) > 0 && c < stack[len(stack)-1] && lastOccurence[stack[len(stack)-1]-'a'] > i {
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			seen[top-'a'] = false
		}

		stack = append(stack, c)
		seen[idx] = true
	}

	return string(stack)
}
