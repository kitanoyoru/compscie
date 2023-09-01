class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)

        for i in range(n+1):
            if i % 2 == 0:
                ans[i] = ans[int(i / 2)]
            else:
                ans[i] = ans[int(i / 2)] + 1

        return ans
