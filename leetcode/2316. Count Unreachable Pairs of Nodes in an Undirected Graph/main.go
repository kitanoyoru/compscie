package main

func countPairs(n int, edges [][]int) int64 {
	adjList := make([][]int, n)

	for _, edge := range edges {
		adjList[edge[0]] = append(adjList[edge[0]], edge[1])
		adjList[edge[1]] = append(adjList[edge[1]], edge[0])
	}

	visited := make([]bool, n)
	sizes := make([]int, n)

	var dfs func(v int) int
	dfs = func(v int) int {
		visited[v] = true
		size := 1
		for _, u := range adjList[v] {
			if !visited[u] {
				size += dfs(u)
			}
		}

		return size
	}

	for i := 0; i < n; i++ {
		if !visited[i] {
			sizes[i] = dfs(i)
		}
	}

	var ans, sum int64
	for _, size := range sizes {
		ans += sum * int64(size)
		sum += int64(size)
	}

	return ans
}
