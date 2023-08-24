package main

func wordBreak(s string, wordDict []string) bool {
	m := map[string]bool{}
	for _, word := range wordDict {
		m[word] = true
	}

	dp := map[string]bool{}

	var solve func(string) bool
	solve = func(cur string) bool {
		if cur == "" {
			return true
		}

		if val, has := dp[cur]; has {
			return val
		}

		for i := 0; i < len(cur); i++ {
			if _, has := m[cur[:i+1]]; has {
				if solve(cur[i+1:]) {
					dp[cur] = true
					return true
				}
			}
		}

		dp[cur] = false
		return false
	}

	return solve(s)
}
