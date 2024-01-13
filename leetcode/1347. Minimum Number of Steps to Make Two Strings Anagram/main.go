package main

func abs(a int) int {
	if a < 0 {
		return -a
	}

	return a
}

func minSteps(s string, t string) int {
	sFreq, tFreq := [26]int{}, [26]int{}

	for i := 0; i < len(s); i++ {
		sFreq[s[i]-'a']++
		tFreq[t[i]-'a']++
	}

	steps := 0
	for i := 0; i < 26; i++ {
		steps += abs(sFreq[i] - tFreq[i])
	}

	return steps / 2
}
