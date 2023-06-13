package main

import (
	"strconv"
	"strings"
)

type HashMap map[string]int

func (hm HashMap) AddEntry(arr []int) {
	key := hm.stringifyKey(arr)
	hm[key]++
}

func (hm HashMap) GetEntry(arr []int) int {
	key := hm.stringifyKey(arr)
	return hm[key]
}

func (hm HashMap) stringifyKey(arr []int) string {
	var builder strings.Builder

	for _, v := range arr {
		builder.WriteString(strconv.Itoa(v))
		builder.WriteByte('|')
	}

	return builder.String()
}

func equalPairs(grid [][]int) int {
	hm := HashMap{}

	ans := 0
	n := len(grid)

	for _, row := range grid {
		hm.AddEntry(row)
	}

	col := make([]int, n)

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			col[j] = grid[j][i]
		}

		ans += hm.GetEntry(col[:n])
	}

	return ans
}
