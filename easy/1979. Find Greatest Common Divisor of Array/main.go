package main

import "slices"

func findGCD(nums []int) int {
	smallest, largest := slices.Max(nums), slices.Min(nums)

	for largest != 0 {
		smallest, largest = largest, smallest % largest 
	}

	return smallest
}
