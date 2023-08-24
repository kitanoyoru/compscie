// Solved by @kitanoyoru
// https://leetcode.com/problems/keys-and-rooms/

const canVisitAllRooms = (rooms: number[][]): boolean => {
  let visited: boolean[] = new Array(rooms.length).fill(false)

  const dfs = (v: number) => {
    visited[v] = true
    for (const u of rooms[v]) {
      if (!visited[u]) {
        dfs(u)
      }
    }
  }

  dfs(0)

  return visited.every((v) => v == true)
}
