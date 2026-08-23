// Solved by @kitanoyoru

package main

func canVisitAllRooms(rooms [][]int) bool {
	visited := make(map[int]bool, len(rooms))

	var dfs func(int)
	dfs = func(cur int) {
		visited[cur] = true
		for _, room := range rooms[cur] {
			if !visited[room] {
				dfs(room)
			}
		}
	}

	dfs(0)

	if len(visited) != len(rooms) {
		return false
	}

	return true
}
