package main

const PossibleXORValues = 1024 // 2 ^ 10

func wonderfulSubstrings(word string) int64 {
	var result int64 = 0

	count := make([]int64, PossibleXORValues)

	prefixXOR := 0
	count[prefixXOR] = 1

	for i := 0; i < len(word); i++ {
		idx := word[i] - 97
		prefixXOR ^= 1 << idx
		result += count[prefixXOR]
		for j := 0; j < 10; j++ {
			result += count[prefixXOR^(1<<j)]

		}
		count[prefixXOR] += 1
	}

	return result
}
