package main

import (
	"strings"
)

func findFreq(colors []string) (int, int) {
	freqA, freqB := 0, 0

	curr, counter := colors[0], 0
	for i := 1; i < len(colors); i++ {
		if colors[i] == curr {
			counter++
			continue
		} else {
			if counter > 3 {
				if curr == "A" {
					freqA++
				} else {
					freqB++
				}
			}
			counter = 0
			curr = colors[i]
		}

	}

	return freqA, freqB
}

func winnerOfGame(colors string) bool {
	freqA, freqB := findFreq(strings.Split(colors, ""))
	return freqA > freqB
}
