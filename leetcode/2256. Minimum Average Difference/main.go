// Solved by @kitanoyoru

package main

import "math"

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func minimumAverageDifference(nums []int) int {
	n, minAvg := len(nums), math.MaxInt
	front, end := 0, 0
	ans := 0

	for _, num := range nums {
		end += num
	}

	for i := 0; i < n; i++ {
		front += nums[i]
		end -= nums[i]

		first := front / (i + 1)
		second := 0

		if i != n-1 {
			second = end / (n - i - 1)
		}

		temp := abs(first - second)
		if temp < minAvg {
			minAvg = temp
			ans = i
		}
	}

	return ans
}
