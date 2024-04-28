package main

func sumOfDistancesInTree(n int, edges [][]int) []int {
	graph := make(map[int][]int, n)
	for _, edge := range edges {
		graph[edge[0]] = append(graph[edge[0]], edge[1])
		graph[edge[1]] = append(graph[edge[1]], edge[0])
	}

	result := make([]int, n)
	count := make([]int, n)
	for i := range count {
		count[i] = 1
	}

	var dfs func(int, int)
	dfs = func(node, parent int) {
		for _, child := range graph[node] {
			if child != parent {
				dfs(child, node)
				count[node] += count[child]
				result[node] += result[child] + count[child]
			}
		}
	}

	var dfs2 func(int, int)
	dfs2 = func(node, parent int) {
		for _, child := range graph[node] {
			if child != parent {
				result[child] = result[node] - count[child] + (n - count[child])
				dfs2(child, node)
			}
		}
	}

	dfs(0, -1)
	dfs2(0, -1)

	return result
}
