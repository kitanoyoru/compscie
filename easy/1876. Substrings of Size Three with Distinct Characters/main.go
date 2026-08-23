// Solved by @kitanoyoru

package main

func countGoodSubstrings(s string) int {
	ans := 0

	for i := 0; i < len(s)-2; i++ {
		hm := make(map[byte]int)

		hm[s[i]]++
		hm[s[i+1]]++
		hm[s[i+2]]++

		if len(hm) == 3 {
			ans++
		}
	}

	return ans
}
