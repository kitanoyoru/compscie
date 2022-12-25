// Solved by @kitanoyoru

package main

func isIsomorphic(s string, t string) bool {
	hm1, hm2 := make(map[byte]byte), make(map[byte]byte)

	for i := 0; i < len(s); i++ {
		if _, ok := hm1[s[i]]; ok == false {
			if _, ok := hm2[t[i]]; ok == true {
				return false
			}
			hm1[s[i]] = t[i]
			hm2[t[i]] = s[i]
		} else if hm1[s[i]] != t[i] {
			return false
		}
	}

	return true
}
