class Solution:
    def numDecodings(self, s: str) -> int:
        n = len(s)

        dp = [0] * (n + 1)
        dp[n] = 1

        for i in range(n-1, -1, -1):
            for j in range(i, n):
                num = int(s[i:j+1])
                if 1 <= num <= 26:
                    dp[i] += dp[j+1]
                else:
                    break

        return dp[0]

