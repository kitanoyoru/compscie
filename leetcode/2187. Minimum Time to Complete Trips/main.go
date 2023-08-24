package main

import "math"

func min(args ...int) int {
	m := math.MaxInt
	for _, arg := range args {
		if arg < m {
			m = arg
		}
	}

	return m
}

func minimumTime(time []int, totalTrips int) int64 {
	l, r := int64(1), int64(min(time...)*totalTrips)

	var trips func(int64) int64
	trips = func(m int64) int64 {
		var acc int64
		for _, t := range time {
			acc += m / int64(t)
		}

		return acc
	}

	for l < r {
		m := (l + r) / 2
		if trips(m) >= int64(totalTrips) {
			r = m
		} else {
			l = m + 1
		}
	}

	return l
}
