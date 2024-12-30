const MOD = 1e9 + 7;

const countGoodStrings = (low: number, high: number, zero: number, one: number): number => {
  let dp: { [key: number]: number } = {};

  const dfs = (length: number): number => {
    if (length > high) {
      return 0
    }

    if (length in dp) {
      return dp[length]
    }

    let count = (length >= low) ? 1 : 0;
    count += dfs(length + zero);
    count %= MOD;
    count += dfs(length + one);
    count %= MOD;

    dp[length] = count;

    return count;
  }

  return dfs(0);
};
