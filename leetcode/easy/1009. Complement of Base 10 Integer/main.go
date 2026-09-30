package main

import "strconv"

func bitwiseComplement(n int) int {
	return n ^ (1<<len(strconv.FormatInt(int64(n), 2)) - 1)
}
