package main

func largestSquareArea(bottomLeft [][]int, topRight [][]int) int64 {
	var (
		maxSide        int64
		x1, x2, y1, y2 int
		width, height  int64

		n = len(bottomLeft)
	)

	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			x1 = max(bottomLeft[i][0], bottomLeft[j][0])
			y1 = max(bottomLeft[i][1], bottomLeft[j][1])
			x2 = min(topRight[i][0], topRight[j][0])
			y2 = min(topRight[i][1], topRight[j][1])

			width, height = int64(x2-x1), int64(y2-y1)

			if width > 0 && height > 0 {
				maxSide = max(maxSide, min(width, height))
			}
		}
	}

	return maxSide * maxSide
}

