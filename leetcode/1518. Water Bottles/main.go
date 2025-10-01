package main

import "math"

func numWaterBottles(numBottles int, numExchange int) int {
	var empty int

	var helper func(bottles int) int
	helper = func(bottles int) int {
		if bottles == 0 {
			return 0
		}

		newBottles := math.Floor((float64(bottles) + float64(empty))/float64(numExchange))
		empty = (bottles + empty) % numExchange

		return bottles + helper(int(newBottles))
	}

	return helper(numBottles)
}

