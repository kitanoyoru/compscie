package main

func countBattleships(board [][]byte) int {
	rows, cols := len(board), len(board[0])

	visited := [][]bool{}
	ans := 0

	var dfs func(int, int)
	dfs = func(i, j int) {
		if i < 0 || i >= rows || j < 0 || j >= cols || board[i][j] == byte('.') {
			return
		}
		visited[i][j] = true
		dfs(i, j+1)
		dfs(i+1, j)
	}

	for i := 0; i < rows; i++ {
		tempArr := []bool{}
		for j := 0; j < cols; j++ {
			tempArr = append(tempArr, false)
		}
		visited = append(visited, tempArr)
	}

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if !visited[i][j] && board[i][j] == byte('X') {
				dfs(i, j)
				ans++
			}
		}
	}

	return ans
}
