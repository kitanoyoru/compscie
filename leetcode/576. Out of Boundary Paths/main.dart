class Solution {
  int findPaths(int m, int n, int N, int x, int y) {
    final int M = 1000000000 + 7;

    List<List<int>> dp = initDP(m, n);

    dp[x][y] = 1;

    int count = 0;

    for (int moves = 1; moves <= N; moves++) {
      List<List<int>> temp = initDP(m, n);

      for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
          if (i == m - 1) count = (count + dp[i][j]) % M;
          if (j == n - 1) count = (count + dp[i][j]) % M;
          if (i == 0) count = (count + dp[i][j]) % M;
          if (j == 0) count = (count + dp[i][j]) % M;

          temp[i][j] =
              (((i > 0 ? dp[i - 1][j] : 0) + (i < m - 1 ? dp[i + 1][j] : 0)) %
                          M +
                      ((j > 0 ? dp[i][j - 1] : 0) +
                              (j < n - 1 ? dp[i][j + 1] : 0)) %
                          M) %
                  M;
        }
      }

      dp = temp;
    }

    return count;
  }

  List<List<int>> initDP(int rows, int cols) {
    return List.generate(rows, (i) => List<int>.filled(cols, 0));
  }
}
