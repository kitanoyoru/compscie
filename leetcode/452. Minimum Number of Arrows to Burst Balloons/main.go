package main

import "sort"

func findMinArrowShots(points [][]int) int {
	sort.Slice(points, func(i, j int) bool {
		return points[i][0] < points[j][0]
	})

	arrows := 1
	end := points[0][1]

	for _, ballon := range points[1:] {
		if ballon[0] > end {
			arrows += 1
			end = ballon[1]
		} else {
			end = min(end, ballon[1])
		}
	}

	return arrows
}
