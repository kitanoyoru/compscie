const nthUglyNumber = (n: number): number => {
  const dp = new Array<number>(n)

  dp[0] = 1

  let [p1, p2, p3] = [0, 0, 0]

  for (let i = 1; i < n; i++) {
    const next2 = dp[p1] * 2
    const next3 = dp[p2] * 3
    const next5 = dp[p3] * 5

    dp[i] = Math.min(next2, next3, next5)

    if (dp[i] === next2) {
      p1++
    }
    if (dp[i] === next3) {
      p2++
    }
    if (dp[i] === next5) {
      p3++
    }
  }

  return dp[n - 1]
}
