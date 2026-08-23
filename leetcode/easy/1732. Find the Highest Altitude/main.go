package main

func largestAltitude(gain []int) int {
	maxAltitude, curAltitude := 0, 0

	for _, gain := range gain {
		curAltitude += gain
		if curAltitude > maxAltitude {
			maxAltitude = curAltitude
		}
	}

	return maxAltitude
}
