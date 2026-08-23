#include <unordered_map>

const int MOD = 1e9 + 7;

class Solution {
public:
  static int countGoodStrings(int low, int high, int zero, int one) {
    std::unordered_map<int, int>
        dp;
    return dfs(0, low, high, zero, one, dp);
  }

private:
  static int dfs(int length, int low, int high, int zero, int one,
                 std::unordered_map<int, int> &dp) {
    if (length > high) {
      return 0;
    }

    if (dp.find(length) != dp.end()) {
      return dp[length];
    }

    int count = (length >= low) ? 1 : 0;
    count += dfs(length + zero, low, high, zero, one, dp);
    count %= MOD;
    count += dfs(length + one, low, high, zero, one, dp);
    count %= MOD;

    dp[length] = count;

    return count;
  }
};

