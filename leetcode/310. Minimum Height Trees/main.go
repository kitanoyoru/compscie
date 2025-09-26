package main

func findMinHeightTrees(n int, edges [][]int) []int {
	graph := make([][]int, n)
	degree := make([]int, n)

	for _, edge := range edges {
		u, v := edge[0], edge[1]

		graph[u] = append(graph[u], v)
		graph[v] = append(graph[v], u)

		degree[u]++
		degree[v]++
	}

	leaves := make([]int, 0, n)
	for v := range n {
		if degree[v] == 1 {
			leaves = append(leaves, v)
		}
	}

	remaining := n
	for remaining > 2 {
		remaining -= len(leaves)
		newLeaves := []int{}

		for _, leave := range leaves {
			for _, neigh := range graph[leave] {
				degree[neigh]--
				if degree[neigh] == 1 {
					newLeaves = append(newLeaves, neigh)
				}
			}
		}

		leaves = newLeaves
	}

	return leaves
}
