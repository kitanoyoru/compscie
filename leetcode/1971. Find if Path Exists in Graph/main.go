// SOlved by @kitanoyoru
package main

func contains(arr []int, val int) bool {
	for _, v := range arr {
		if v == val {
			return true
		}
	}

	return false
}

func validPath(n int, edges [][]int, source int, destination int) bool {
	if len(edges) == 0 && source == destination {
		return true
	}

	visited := make([]bool, n)
	graph := make(map[int][]int)
	ans := false

	var dfs func(int, int)
	dfs = func(start, end int) {
		if !visited[start] && !ans {
			if start == end {
				ans = true
				return
			}

			visited[start] = true
			for _, neigh := range graph[start] {
				dfs(neigh, end)
			}
		}
	}

	for _, edge := range edges {
		if !contains(graph[edge[0]], edge[1]) {
			graph[edge[0]] = append(graph[edge[0]], edge[1])
		}
		if !contains(graph[edge[1]], edge[0]) {
			graph[edge[1]] = append(graph[edge[1]], edge[0])
		}
	}

	if contains(graph[source], destination) {
		return true
	}

	dfs(source, destination)

	return ans
}
