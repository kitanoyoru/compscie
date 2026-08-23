from math import prod


class Solution:
    def checkDivisibility(self, n: int) -> bool:
        return n % (sum(d := list(map(int, str(n)))) + prod(d)) == 0
