package main

import (
	"fmt"
	"strconv"
)

func readBinaryWatch(turnedOn int) []string {
	var res []string

	for i := 0; i < 12; i++ {
		for j := 0; j < 60; j++ {
			hours := countOnes(strconv.FormatUint(uint64(i), 2))
			minutes := countOnes(strconv.FormatUint(uint64(j), 2))

			if hours+minutes == turnedOn {
				res = append(res, fmt.Sprintf("%v:%02d", i, j))
			}
		}
	}

	return res
}

func countOnes(v string) int {
	res := 0

	for _, c := range v {
		if c == '1' {
			res++

		}
	}

	return res
}
