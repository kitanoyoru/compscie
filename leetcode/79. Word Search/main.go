package main

var Directions = [][]int{
	{-1, 0}, // left
	{0, 1},  // up
	{1, 0},  // right
	{0, -1}, // bottom
}

func exist(board [][]byte, word string) bool {
	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[0]); j++ {
			if backtracking(board, word, 0, i, j) {
				return true
			}
		}
	}

	return false
}

func backtracking(board [][]byte, word string, idx, i, j int) bool {
	if idx == len(word) {
		return true
	}

	if i < 0 || i >= len(board) || j < 0 || j >= len(board[0]) || board[i][j] != word[idx] {
		return false
	}

	temp := board[i][j]
	board[i][j] = '#'

	for _, d := range Directions {
		if backtracking(board, word, idx+1, i+d[0], j+d[1]) {
			return true
		}
	}

	board[i][j] = temp

	return false
}
