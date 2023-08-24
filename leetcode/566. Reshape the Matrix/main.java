// Solved by @kitanoyoru
// https://leetcode.com/problems/reshape-the-matrix/

class Solution {
    public int[][] matrixReshape(int[][] mat, int r, int c) {
      if ((mat.length * mat[0].length) / c != r) {
        return mat;
      }

      int[][] ans = new int[r][c];

      int row = 0, col = 0;

      for (var i = 0; i < r; i++) {
        for (var j = 0; j < c; j++) {
          ans[i][j] = mat[row][col];
          if (col == mat[row].length - 1) {
            row++;
            col = 0;
          } else {
            col++;
          }
        }
      }

      return ans;
    }
}
