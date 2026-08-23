package main

func restoreArray(adjacentPairs [][]int) []int {
	graph := make(map[int][]int)

	for _, pair := range adjacentPairs {
		graph[pair[0]] = append(graph[pair[0]], pair[1])
		graph[pair[1]] = append(graph[pair[1]], pair[0])
	}

	var result []int

	for node, neigh := range graph {
		if len(neigh) == 1 {
			result = []int{node, neigh[0]}
			break
		}
	}

	for len(result) < len(adjacentPairs)+1 {
		last, prev := result[len(result)-1], result[len(result)-2]
		candidates := graph[last]

		var nextElement int
		if candidates[0] != prev {
			nextElement = candidates[0]
		} else {
			nextElement = candidates[1]
		}

		result = append(result, nextElement)
	}

	return result
}
