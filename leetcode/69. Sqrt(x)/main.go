package main

func mySqrt(x int) int {
	if x == 1 {
		return 1
	}

	left, mid, right := 0, -1, x/2

	for left <= right {
		mid = left + (right-left)/2
		square := mid * mid

		if square > x {
			right = mid - 1
		} else if mid*mid == x {
			return mid
		} else {
			left = mid + 1
		}
	}

	return right 
}

