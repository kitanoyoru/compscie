package main

func threeConsecutiveOdds(arr []int) bool {
	result := false

	counter := 0
	for _, val := range arr {
		if val%2 == 1 {
			counter++
			if counter == 3 {
				result = true
				break
			}
		} else {
			counter = 0
		}

	}

	return result
}
