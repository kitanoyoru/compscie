// Solved by @kitanoyoru

package main

func findRedundantConnection(edges [][]int) []int {
	connected := make(map[int][]int)
	for _, e := range edges {
		visited := make(map[int]bool)
		x, y := e[0], e[1]
		if is_connected(x, y, &connected, &visited) {
			return e
		}
		connected[x] = append(connected[x], y)
		connected[y] = append(connected[y], x)
	}

	return []int{}
}

func is_connected(x, y int, connected *map[int][]int, visited *map[int]bool) bool {
	if x == y {
		return true
	}
	for _, x_adj := range (*connected)[x] {
		if !(*visited)[x_adj] {
			(*visited)[x_adj] = true
			if is_connected(x_adj, y, connected, visited) {
				return true
			}
		}
	}

	return false
}
