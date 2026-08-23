package main

import "math"

func max(arr []int) int {
	max := math.MinInt

	for _, val := range arr {
		if val > max {
			max = val
		}
	}

	return max
}

func kidsWithCandies(candies []int, extraCandies int) []bool {
	max_candy := max(candies)

	res := []bool{}

	for _, candy := range candies {
		if candy+extraCandies >= max_candy {
			res = append(res, true)
		} else {
			res = append(res, false)
		}
	}

	return res
}
