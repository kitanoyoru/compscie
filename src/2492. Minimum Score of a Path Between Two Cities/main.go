package main

import "math"

type Entry struct {
	Index int
	Value int
}

func NewEntry(index, value int) *Entry {
	return &Entry{
		Index: index,
		Value: value,
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}

func minScore(n int, roads [][]int) int {
	graph := make([][]*Entry, n+1)

	for _, road := range roads {
		row, col, val := road[0], road[1], road[2]

		graph[row] = append(graph[row], NewEntry(col, val))
		graph[col] = append(graph[col], NewEntry(row, val))

	}

	visited := make([]bool, n+1)
	minWeight := math.MaxInt
	queue := []int{1}

	for len(queue) != 0 {
		node := queue[0]
		queue = queue[1:]

		for _, v := range graph[node] {
			if !visited[v.Index] {
				visited[v.Index] = true
				queue = append(queue, v.Index)
			}
			minWeight = min(v.Value, minWeight)
		}
	}

	return minWeight
}
