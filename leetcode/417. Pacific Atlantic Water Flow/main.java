// Solved by @kitanoyoru
// https://leetcode.com/problems/pacific-atlantic-water-flow/

import java.util.*;

cclass Solution {
  int[][] DIRECTIONS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
  
  private boolean dfs(int sr, int sc, int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    boolean atlantic = false, pacific = false;
    boolean[][] visited = new boolean[rows][cols];
    
    Queue<int[]> q = new LinkedList();

    while (!q.isEmpty()) {
      int[] entry = q.remove();
      for (int[] d : DIRECTIONS) {
        int newRow = entry[0] + d[0];
        int newCol = entry[1] + d[1];
        System.out.println(newRow);

        if (newRow < 0 || newCol < 0) {
          pacific = true;
          continue;
        }
        if (newRow >= rows || newCol >= cols) {
          atlantic = true;
          continue;
        }
        if (grid[newRow][newCol] <= grid[entry[0]][entry[1]]
            && ! visited[newRow][newCol]) {
          visited[newRow][newCol] = true;
          q.add(new int[] {newRow, newCol});
        }
      }
    }

    return atlantic && pacific;
  }

  public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    List<List<Integer>> ans = new ArrayList<>();


    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        boolean res = dfs(i, j, heights);
        if (res) {
          ans.add(List.of(i, j));
        }
      }
    }

    return ans;
  }
}
lass Solution {
  int[][] DIRECTIONS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
  
  private boolean dfs(int sr, int sc, int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    boolean atlantic = false, pacific = false;
    boolean[][] visited = new boolean[rows][cols];
    
    Queue<int[]> q = new LinkedList();
    q.add(new int {sr, sc});

    while (!q.isEmpty()) {
      int[] entry = q.remove();
      for (int[] d : DIRECTIONS) {
        int newRow = entry[0] + d[0];
        int newCol = entry[1] + d[1];

        if (newRow < 0 || newCol < 0) {
          pacific = true;
          continue;
        }
        if (newRow >= rows || newCol >= cols) {
          atlantic = true;
          continue;
        }
        if (grid[newRow][newCol] <= grid[entry[0]][entry[1]]
            && ! visited[newRow][newCol]) {
          visited[newRow][newCol] = true;
          q.add(new int[] {newRow, newCol});
        }
      }
    }

    return atlantic && pacific;
  }

  public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    List<List<Integer>> ans = new ArrayList<>();


    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        boolean res = dfs(i, j, heights);
        if (res) {
          ans.add(List.of(i, j));
        }
      }
    }

    return ans;
  }
}
