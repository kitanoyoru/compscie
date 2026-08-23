from collections import Counter

from itertools import groupby


class Solution:
    def winnerOfGame(self, colors: str) -> bool:
        c = Counter()
        for x, t in groupby(colors):
            c[x] += max(len(list(t)) - 2, 0)

        return c["A"] > c["B"]
