package main

func numberOfBeams(bank []string) int {
	result, prevRowBeams := 0, 0

	for _, row := range bank {
		curRowBeams := findBeamsInRow(row)
		if curRowBeams == 0 {
			continue
		}

		result += prevRowBeams * curRowBeams
		prevRowBeams = curRowBeams
	}

	return result
}

func findBeamsInRow(row string) int {
	count := 0

	for i := 0; i < len(row); i++ {
		count += int(row[i] - '0')
	}

	return count
}
