// Solved by @kitanoyoru

package main

import "strconv"

func digitCount(num string) bool {
	hm := make(map[int]int)

	for _, val := range num {
		v, _ := strconv.Atoi(string(val))
		hm[v]++
	}

	for i := 0; i < len(num); i++ {
		numi, _ := strconv.Atoi(string(num[i]))
		if hm[i] != numi {
			return false
		}
	}

	return true
}
