from functools import reduce


class Solution:
    def minSteps(self, s: str, t: str) -> int:
        s_freq, t_freq = [0] * 26, [0] * 26

        for i in range(len(s)):
            s_freq[ord(s[i]) - ord("a")] += 1
            t_freq[ord(t[i]) - ord("a")] += 1

        steps = reduce(
            lambda sum, idx: sum + abs(s_freq[idx] - t_freq[idx]), range(26), 0
        )

        return steps // 2
