// Solved by @kitanoyoru
// https://leetcode.com/problems/unique-paths/

const uniquePaths = (m: number, n: number) => {
  if (m == 1 || n == 1) {
    return 1
  }

  let dp = new Array(n).fill(0)
  dp[0] = 1

  for (let row = 0; row < m; row++) {
    for (let col = 1; col < n; col++) {
      dp[col] += dp[col - 1]
    }
  }

  return dp[n - 1]
}
