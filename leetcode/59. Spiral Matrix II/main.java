// Solved by @kitanoyoru
// https://leetcode.com/problems/spiral-matrix-ii/

class Solution {
  public int[][] generateMatrix(int n) {
    int[][] matrix = new int[n][n];

    int top = 0, bottom = n - 1;
    int left = 0, right = n - 1;

    int counter = 1;

    while (top <= bottom && left <= right) {
      for (int i = left; i <= right; i++) {
        matrix[top][i] = counter;
        counter++;
      }
      top++;
      for (int i = top; i <= bottom; i++) {
        matrix[i][right] = counter;
        counter++;
      }
      right--;
      if (top <= bottom) {
        for (int i = right; i >= left; i--) {
          matrix[bottom][i] = counter;
          counter++;
        }
        bottom--;
      }
      if (left <= right) {
        for (int i = bottom; i >= top; i--) {
          matrix[i][left] = counter;
          counter++;
        }
        left++;
      }
    }

    return matrix;
  }
}
