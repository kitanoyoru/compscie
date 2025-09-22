package main

func reverseVowels(s string) string {
	var vowels = map[byte]struct{}{
		'a': {},
		'e': {},
		'i': {},
		'o': {},
		'u': {},

		'A': {},
		'E': {},
		'I': {},
		'O': {},
		'U': {},
	}

	sarr := []byte(s)

	i, j := 0, len(s)-1

	for ; i < len(s); i++ {
		if _, iok := vowels[s[i]]; iok {
			for ; j >= i; j-- {
				if _, jok := vowels[s[j]]; jok {
					sarr[i], sarr[j] = sarr[j], sarr[i]
					j--
					break
				}
			}
		}

		if i == j {
			break
		}
	}

	return string(sarr)
}

