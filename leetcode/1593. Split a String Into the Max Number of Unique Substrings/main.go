package main

func maxUniqueSplit(s string) int {
	visited := make(map[string]struct{})

	var backtrack func(start int) int
	backtrack = func(start int) int {
		if start == len(s) {
			return 0
		}

		maxSplits := 0

		for end := start + 1; end < len(s)+1; end++ {
			substr := s[start:end]

			if _, ok := visited[substr]; !ok {
				visited[substr] = struct{}{}
				maxSplits = max(maxSplits, 1+backtrack(end)) 
				delete(visited, substr)
			}
		}

		return maxSplits
	}

	return backtrack(0)
}
