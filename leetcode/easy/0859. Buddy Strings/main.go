package main

func buddyStrings(s string, goal string) bool {
	if len(s) != len(goal) {
		return false
	}

	if s == goal {
		seen := make(map[byte]struct{}, len(s))
		for i := 0; i < len(s); i++ {
			if _, ok := seen[s[i]]; ok {
				return true
			}

			seen[s[i]] = struct{}{}
		}

		return false
	}

	first, second := -1, -1

	for i := 0; i < len(s); i++ {
		if s[i] != goal[i] {
			if first == -1 {
				first = i
			} else if second == -1 {
				second = i
			} else {
				return false
			}
		}
	}

	return second != -1 && s[first] == goal[second] && s[second] == goal[first]
}
