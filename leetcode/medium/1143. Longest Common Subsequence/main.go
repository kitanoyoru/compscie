// Solved by @kitanoyoru

package main

func longestCommonSubsequence(text1 string, text2 string) int {
	m := [1001][1001]int{}

	for i := 0; i < len(text1); i++ {
		for j := 0; j < len(text2); j++ {
			if text1[i] == text2[j] {
				m[i+1][j+1] = m[i][j] + 1
			} else {
				m[i+1][j+1] = max(m[i+1][j], m[i][j+1])
			}
		}
	}

	return m[len(text1)][len(text2)]
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}
