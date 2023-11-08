package main

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

func chebyshev(sx, sy, fx, fy int) int {
	return max(abs(sx-fx), abs(sy-fy))
}

func isReachableAtTime(sx, sy, fx, fy, t int) bool {
	d := chebyshev(sx, sy, fx, fy)
	return d > 0 && t >= d || d == 0 && t != 1
}
