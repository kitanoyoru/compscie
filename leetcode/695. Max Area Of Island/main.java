// Solved by @kitanoyoru
// https://leetcode.com/problems/max-area-of-island/

import java.util.Stack;

class Solution {
  private int[][] DIRECTIONS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

  public int maxAreaOfIsland(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int maxArea = 0; 
    
    boolean[][] visited = new boolean[rows][cols];

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (grid[i][j] == 1 && !visited[i][j]) {
          int val = dfs(grid, visited, i, j, rows, cols);
          if (val > maxArea) {
            maxArea = val;
          }
        }
      }
    }

    return maxArea;
  }

  private int dfs(int[][] grid, boolean[][] visited, int sr, int sc, int rows, int cols) {
    int counter = 1;
    Stack<int[]> s = new Stack<>();

    visited[sr][sc] = true;
    s.add(new int[] {sr, sc});
    
    while (!s.isEmpty()) {
      int[] node = s.pop();
      for (int[] d : DIRECTIONS) {
        int row = node[0] + d[0];
        int col = node[1] + d[1];
        if (row >= 0 && row < rows && col >= 0 && col < cols && !visited[row][col] && grid[row][col] == 1) {
          visited[row][col] = true;
          counter++;
          s.add(new int[] {row, col});
        }
      }
    }

    return counter;
  }
}
