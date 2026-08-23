package main

func getWinner(arr []int, k int) int {
	if k == 1 {
		return max(arr[0], arr[1])
	}
	if k >= len(arr) {
		return maxInSlice(arr)
	}

	winner := arr[0]
	consecutiveWins := 0

	for i := 1; i < len(arr); i++ {
		if winner > arr[i] {
			consecutiveWins++
		} else {
			winner = arr[i]
			consecutiveWins = 1
		}

		if consecutiveWins == k {
			return winner
		}
	}

	return winner
}

func maxInSlice(arr []int) int {
	num := 0

	for _, v := range arr {
		num = max(num, v)
	}

	return num
}
