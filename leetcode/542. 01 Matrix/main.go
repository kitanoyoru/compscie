package main

import "math"

type Queue struct {
	inner [][]int
}

func NewQueue() *Queue {
	return &Queue{}
}

func (q *Queue) Add(cell []int) {
	q.inner = append(q.inner, cell)
}

func (q *Queue) Pop() []int {
	last := q.inner[len(q.inner)-1]
	q.inner = q.inner[:len(q.inner)-1]
	return last
}

func (q *Queue) IsEmpty() bool {
	return len(q.inner) == 0
}

func updateMatrix(mat [][]int) [][]int {
	n, m := len(mat), len(mat[0])

	q := NewQueue()
	dirs := [][]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

	for row := 0; row < n; row++ {
		for col := 0; col < m; col++ {
			if mat[row][col] == 1 {
				mat[row][col] = math.MaxInt
			} else {
				q.Add([]int{row, col})
			}
		}
	}

	for !q.IsEmpty() {
		cell := q.Pop()

		for _, d := range dirs {
			row := cell[0] + d[0]
			col := cell[1] + d[1]

			if row >= 0 && row < n && col >= 0 && col < m {
				if mat[row][col] > mat[cell[0]][cell[1]]+1 {
					q.Add([]int{row, col})
					mat[row][col] = mat[cell[0]][cell[1]] + 1
				}
			}
		}
	}

	return mat
}
