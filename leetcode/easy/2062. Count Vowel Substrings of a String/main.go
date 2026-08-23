package main

var Vowels = map[byte]struct{}{
	'a': {},
	'e': {},
	'i': {},
	'o': {},
	'u': {},
}

func countVowelSubstrings(word string) int {
	result, n := 0, len(word)

	for i := 0; i < n; i++ {
		visited := make(map[byte]struct{})
		for j := i; j < n; j++ {
			if _, isVowel := Vowels[word[j]]; !isVowel {
				break
			}
			visited[word[j]] = struct{}{}

			if len(visited) == 5 {
				result++
			}
		}
	}

	return result
}

