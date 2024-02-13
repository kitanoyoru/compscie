package kata

func Race(v1, v2, g int) [3]int {
	if v1 >= v2 {
		return [3]int{-1, -1, -1}
	}

	seconds := g / (v2 - v1) * 3600

	hours := seconds / 3600
	seconds %= 3600

	minutes := seconds / 60
	seconds %= 60

	return [3]int{hours, minutes, seconds}
}
