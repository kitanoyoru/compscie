package main

import "sort"

func leastInterval(tasks []byte, n int) int {
	freq := make([]int, 26)
	for _, t := range tasks {
		freq[t-'A']++
	}
	sort.Ints(freq)

	chunk := freq[25] - 1
	idle := chunk * n

	for i := 24; i >= 0; i-- {
		idle -= min(chunk, freq[i])
	}

	if idle < 0 {
		return len(tasks)
	}

	return len(tasks) + idle
}
