package main

func maxArea(height []int) int {
	left, right := 0, len(height)-1

	var maxSpace int

	for left < right {
		h := min(height[left], height[right])
		w := right - left

		area := h * w

		if area > maxSpace {
			maxSpace = area
		}

		if height[left] < height[right] {
			left++
		} else {
			right--
		}
	}

	return maxSpace
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func abs(value int) int {
	if value < 0 {
		return -value
	}

	return value
}
