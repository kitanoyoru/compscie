package main

func isBipartite(graph [][]int) bool {
	color := make([]int, len(graph))
	for i := range color {
		color[i] = -1
	}

	for i := range len(graph) {
		if color[i] == -1 {
			color[i] = 0

			queue := []int{i}

			for len(queue) > 0 {
				v := queue[0]
				queue = queue[1:]

				for _, u := range graph[v] {
					if color[u] == -1 {
						color[u] = 1 - color[v]
						queue = append(queue, u)
					} else if color[v] == color[u] {
						return false
					} 
				}
			}
		}
	}

	return true
}
