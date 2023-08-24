// Solved by @kitanoyoru

package main

func repeatedCharacter(s string) byte {
	hm := make(map[byte]bool)

	for i := 0; i < len(s); i++ {
		if _, ok := hm[s[i]]; ok == true {
			return s[i]
		}
		hm[s[i]] = true
	}

	return ' '
}
