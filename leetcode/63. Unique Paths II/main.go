package main

func uniquePathsWithObstacles(obstacleGrid [][]int) int {
	n, m := len(obstacleGrid), len(obstacleGrid[0])

	prev := make([]int, m)
	curr := make([]int, m)

	prev[0] = 1

	for i := 0; i < n; i++ {
		if obstacleGrid[i][0] == 1 {
			curr[0] = 0
		} else {
			curr[0] = prev[0]
		}

		for j := 1; j < m; j++ {
			if obstacleGrid[i][j] == 1 {
				curr[j] = 0
			} else {
				curr[j] = curr[j-1] + prev[j]
			}
		}

		prev, curr = curr, prev
	}

	return prev[m-1]
}
