func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func eraseOverlapIntervals(intervals [][]int) int {
	sort.Slice(intervals, func(i, j int) bool {
		first, second := intervals[i], intervals[j]

		if first[0] == second[0] {
			return first[1] < second[1]
		}

		return first[0] < second[0]
	})

	counter, prev := 0, intervals[0][1]

	for _, interval := range intervals[1:] {
		if interval[0] < prev {
			counter++
			prev = min(prev, interval[1])
		} else {
			prev = interval[1]
		}
	}

	return counter
}
