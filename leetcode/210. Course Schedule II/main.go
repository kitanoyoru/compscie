package main

func findOrder(numCourses int, prerequisites [][]int) []int {
	var (
		graph  = make([][]int, numCourses)
		degree = make([]int, numCourses)
	)
	for _, pre := range prerequisites {
		u, v := pre[0], pre[1]
		graph[v] = append(graph[v], u)
		degree[u]++
	}

	var (
		result = make([]int, 0, numCourses)
		queue  = make([]int, 0, numCourses)
	)

	for v := range numCourses {
		if degree[v] == 0 {
			queue = append(queue, v)
		}
	}

	for len(queue) > 0 {
		v := queue[0]
		queue = queue[1:]

		result = append(result, v)

		for _, u := range graph[v] {
			degree[u]--
			if degree[u] == 0 {
				queue = append(queue, u)
			}
		}
	}

	if len(result) == numCourses {
		return result
	}

	return []int{}
}
