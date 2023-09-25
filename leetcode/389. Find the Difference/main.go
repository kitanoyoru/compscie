package main

func findTheDifference(s string, t string) byte {
	sSum, tSum := byte(0), byte(0)

	for i := 0; i < len(s); i++ {
		sSum += s[i]
	}

	for i := 0; i < len(t); i++ {
		tSum += t[i]
	}

	return tSum - sSum
}
