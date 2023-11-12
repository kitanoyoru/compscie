package main

import "cmp"

func maxInArray[T cmp.Ordered](arr []T) T {
	maxNum := arr[0]

	for i := 1; i < len(arr); i++ {
		if maxNum < arr[i] {
			maxNum = arr[i]
		}
	}

	return maxNum
}

func minEatingSpeed(piles []int, h int) int {
	var canEat func(int) bool
	canEat = func(k int) bool {
		actH := 0

		for _, pile := range piles {
			actH += (pile + k - 1) / k
		}

		return actH <= h
	}

	left, right := 1, maxInArray(piles)

	for left < right {
		mid := (left + right) / 2
		if canEat(mid) {
			right = mid
		} else {
			left = mid + 1
		}
	}

	return left
}
