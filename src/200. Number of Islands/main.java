// Solved by @kitanoyoru
// https://leetcode.com/problems/number-of-islands/

class Solution {
  int[][] DIRECTIONS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

  private void dfs(int sr, int sc, char[][] grid, boolean[][] visited, int rows, int cols) {
    Queue<int[]> q = new LinkedList<>();

    q.add(new int[] {sr, sc});
    visited[sr][sc] = true;

    while (!q.isEmpty()) {
      int[] entry = q.remove();
      for (var d : DIRECTIONS ) {
        int newRow = entry[0] + d[0];
        int newCol = entry[1] + d[1];
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol] && grid[newRow][newCol] == '1') {
          q.add(new int[] {newRow, newCol});
          visited[newRow][newCol] = true;
        }
      }
    }
  }

  public int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int counter = 0;
    boolean[][] visited = new boolean[rows][cols];

    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (grid[i][j] == '1' && !visited[i][j]) {
          dfs(i, j, grid, visited, rows, cols);
          counter++;
        }
      }
    }

    return counter;
  }
}
