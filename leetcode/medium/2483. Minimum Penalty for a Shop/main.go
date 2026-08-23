package main

func bestClosingTime(customers string) int {
	max_penalty, penalty, max_penalty_idx := 0, 0, -1

	for i := 0; i < len(customers); i++ {
		if customers[i] == 'Y' {
			penalty++
		} else {
			penalty--
		}

		if penalty > max_penalty {
			max_penalty = penalty
			max_penalty_idx = i
		}
	}

	return max_penalty_idx + 1
}
