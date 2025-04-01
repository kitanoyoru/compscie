package main

func checkValidCuts(n int, rectangles [][]int) bool {
	grid := make([][]bool, n)
	for i := range grid {
		grid[i] = make([]bool, n)
	}

	for _, rect := range rectangles {
		x1, y1, x2, y2 := rect[0], rect[1], rect[2], rect[3]

		if x1 < 0 || y1 < 0 || x2 > n || y2 > n || x1 >= x2 || y1 >= y2 {
			return false
		}

		for i := x1; i < x2; i++ {
			for j := y1; j < y2; j++ {
				if grid[i][j] {
					return false
				}

				grid[i][j] = true
			}
		}
	}

	return true
}
