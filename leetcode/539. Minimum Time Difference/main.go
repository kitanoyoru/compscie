package main

import (
	"math"
	"sort"
	"strconv"
	"strings"
)

func findMinDifference(timePoints []string) int {
	minutes := make([]int, len(timePoints))
	for i, v := range timePoints {
		parts := strings.Split(v, ":")

		parsedMinutes, _ := strconv.Atoi(parts[1])
		parsedHours, _ := strconv.Atoi(parts[0])

		minutes[i] = 60*parsedHours + parsedMinutes
	}

	sort.Ints(minutes)

	res := math.MaxInt
	for i := 0; i < len(minutes); i++ {
		next := (i + 1) % len(minutes)
		diff := minutes[next] - minutes[i]

		if i == len(minutes)-1 {
			diff += 1440
		}

		if diff < res {
			res = diff
		}
	}

	return res
}
