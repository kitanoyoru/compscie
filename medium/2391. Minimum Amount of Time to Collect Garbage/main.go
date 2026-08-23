package main

import "strings"

func garbageCollection(garbage []string, travel []int) int {
	res, n := 0, len(garbage)

	for i := 0; i < n-1; i++ {
		res += 3 * travel[i]
	}
	for _, s := range garbage {
		res += len(s)
	}

	for i := n - 1; i > 0; i-- {
		if !strings.Contains(garbage[i], "G") {
			res -= travel[i-1]
		} else {
			break
		}
	}
	for i := n - 1; i > 0; i-- {
		if !strings.Contains(garbage[i], "P") {
			res -= travel[i-1]
		} else {
			break
		}
	}
	for i := n - 1; i > 0; i-- {
		if !strings.Contains(garbage[i], "M") {
			res -= travel[i-1]
		} else {
			break
		}
	}

	return res
}
