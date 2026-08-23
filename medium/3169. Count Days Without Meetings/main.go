package main

import "sort"

func countDays(days int, meetings [][]int) int {
	sort.Slice(meetings, func(i, j int) bool {
		return meetings[i][0] < meetings[j][0]
	})

	merged := make([][]int, 0, len(meetings))
	for _, meet := range meetings {
		if len(merged) == 0 || meet[0] > merged[len(merged)-1][1] {
			merged = append(merged, meet)
		} else {
			merged[len(merged)-1][1] = max(merged[len(merged)-1][1], meet[1])
		}
	}

	var result int
	for _, meet := range merged {
		result += meet[1] - meet[0] + 1
	}

	return days - result
}
