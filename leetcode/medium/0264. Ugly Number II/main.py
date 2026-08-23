class Solution:
    def nthUglyNumber(self, n: int) -> int:
        dp = [0] * n

        dp[0] = 1

        p1 = p2 = p3 = 0

        for i in range(1, n):
            next2 = dp[p1] * 2
            next3 = dp[p2] * 3
            next5 = dp[p3] * 5

            dp[i] = min(next2, next3, next5)

            if dp[i] == next2:
                p1 += 1
            if dp[i] == next3:
                p2 += 1
            if dp[i] == next5:
                p3 += 1

        return dp[-1]
