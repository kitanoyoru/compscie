// Solved by @kitanoyoru
// https://leetcode.com/problems/flood-fill/

import java.util.LinkedList;
import java.util.Queue;

class Solution {
  private int[][] DIRECTIONS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}}; 

  public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int rows = image.length, cols = image[0].length;
    int sourceColor = image[sr][sc];
    int[] source = {sr, sc};
    
    Queue<int[]> q = new LinkedList<>();
    boolean[][] visited = new boolean[rows][cols];
    
    visited[sr][sc] = true;
    image[sr][sc] = color;
    q.add(source);

    while (!q.isEmpty()) {
      int[] node = q.remove();
      for (int[] d : DIRECTIONS) {
        int row = node[0] + d[0];
        int col = node[1] + d[1];
        if (row >= 0 && row < rows && col >= 0 && col < cols && !visited[row][col] && image[row][col] == sourceColor) {
          visited[row][col] = true;
          image[row][col] = color;
          q.add(new int[] {row, col});
        }
      }
    }

    return image;
  }
}
