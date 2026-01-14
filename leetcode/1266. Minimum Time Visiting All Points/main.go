package main

func minTimeToVisitAllPoints(points [][]int) int {
	var result int

	for i := 0; i < len(points)-1; i++ {
		x, y := abs(points[i][0]-points[i+1][0]), abs(points[i][1]-points[i+1][1])
		result += min(x, y)
		if abs(x-y) > 0 {
			result += abs(x - y)
		}
	}

	return result
}

func abs(value int) int {
	if value < 0 {
		return -value
	}

	return value
}

