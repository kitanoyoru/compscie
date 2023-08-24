// Solved by @kitanoyoru
// https://leetcode.com/problems/keys-and-rooms/

class Solution {
  private void dfs(boolean[] visited, List<List<Integer>> rooms, int v) {
    visited[v] = true;
    for (int u : rooms.get(v)) {
      if (!visited[u]) {
        dfs(visited, rooms, u);
      }
    }
  }

  public boolean canVisitAllRooms(List<List<Integer>> rooms) {
    boolean[] visited = new boolean[rooms.size()];

    dfs(visited, rooms, 0);

    for (boolean val : visited) {
      if (!val) {
        return false;
      }
    }

    return true;
  }
}

