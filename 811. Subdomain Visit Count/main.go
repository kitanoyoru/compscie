// Solved by @kitanoyoru

package main

import (
	"strconv"
)

func subdomainVisits(cpdomains []string) (ans []string) {
	hm := make(map[string]int)

	var s string
	var n int

	for _, cpdomain := range cpdomains {
		for i, v := range cpdomain {
			if v == ' ' {
				n, _ = strconv.Atoi(cpdomain[:i])
				s = cpdomain[i+1:]
			}
		}
		hm[s] += n
		for i, v := range s {
			if v == '.' {
				hm[s[i+1:]] += n
			}
		}
	}

	for k, v := range hm {
		a := strconv.Itoa(v) + " " + k
		ans = append(ans, a)
	}

	return
}
